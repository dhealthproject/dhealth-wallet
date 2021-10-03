/*
 * Copyright 2021-present [Using Blockchain Ltd](https://using-blockchain.org), All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import Vue from 'vue';
import * as _ from 'lodash';
import { PluginBridge } from '@dhealth/wallet-api-bridge';

import { PluginModelStorage } from '@/core/database/storage/PluginModelStorage';
import { PluginModel } from '@/core/database/entities/PluginModel';
import { DatabaseService } from './DatabaseService';

/**
 * @type {PluginActionPayload}
 * @description Action requests sent from a plugin to the App use the
 * following payload type. Action requests are described by \a plugin
 * and also by \a type and \a action. The arguments passed in \a args
 * are optional and forwarded to the app when present.
 */
export type PluginActionPayload = {
    plugin: string;
    type: string;
    action: string;
    args: any | undefined;
};

/**
 * @interface {MinimalVuexStoreImpl}
 * @description This interface defines min Vuex Store implementations
 * that can be passed to some methods to override the Store instance.
 */
export interface MinimalVuexStoreImpl {
    dispatch: (action: string, args?: any, opts?: any) => any;
    commit: (mutation: string, args: any) => any;
    rootGetters: any;
}

/**
 * @type {PluginSearchResponse}
 * @description Plugin searches using NPM use the following payload for
 * responses. This allows to check for  existence of modules using  NPM
 * and determining compatibility internally.
 */
export type PluginSearchResponse = {
    npmModule: string;
    isCompatible: boolean;
    reason?: string;
};

/**
 * @enum {PluginRecipeStatus}
 * @description This enumeration contains status values for the recipe
 * build jobs running on our public Jenkins.
 */
export enum PluginRecipeStatus {
    Pending = 'pending',
    Error = 'error',
    Uploaded = 'uploaded',
    Building = 'building',
    Success = 'success',
}

/**
 * @class {PluginService}
 * @description This service class provides methods to handle plugins
 * communication and state changes.
 */
export class PluginService {
    /**
     * The plugins information local cache.
     * @note The database uses a singleton pattern.
     * @var  {PluginModelStorage}
     */
    private readonly pluginModelStorage = PluginModelStorage.INSTANCE;

    /**
     * The list of authorized plugin publishers. Only plugins
     * by these publishers can be installed using the manager
     * and custom plugins must be installed manually.
     *
     * @var {string[]}
     */
    private readonly KNOWN_PUBLISHERS: string[] = ['@yourdlt', '@dhealth', '@ubcdigital'];

    /**
     * The plugins request blacklists. We blacklist any store
     * getter that retrieves sensitive data like private keys
     * and/or account and profile models.
     *
     * For security reasons, actions and mutations are denied
     * access except for the ones that are whitelisted below.
     *
     * @var {{ [key: string]: string[] }}
     */
    private readonly BLACKLISTS: { [key: string]: string[] } = {
        getter: [
            'account/currentAccount',
            'account/knownAccounts',
            'account/currentSignerAccountModel',
            'profile/currentProfile',
            'harvesting/currentSignerHarvestingModel',
            // wildcard denials
            'temporary/*',
        ],
        action: ['*'],
        mutation: ['*'],
    };

    /**
     * The plugins request whitelists. The whitelist consists
     * of some network information and necessary account data
     * like namespaces, mosaics, harvesting statistics, etc.
     *
     * The databse, diagnostic and notification store modules
     * are generally whitelisted.
     *
     * @var {{ [key: string]: string[] }}
     */
    private readonly WHITELISTS: { [key: string]: string[] } = {
        action: [
            'app/SET_LOADING_OVERLAY',
            'account/GET_RECIPIENT',
            'account/LOAD_ACCOUNT_INFO',
            'block/GET_BLOCK',
            'transaction/LOAD_TRANSACTIONS',
            'transaction/LOAD_TRANSACTION_DETAILS',
            'harvesting/LOAD_HARVESTED_BLOCKS',
            'harvesting/LOAD_HARVESTED_BLOCKS_STATS',
            'mosaic/LOAD_NETWORK_CURRENCIES',
            'mosaic/LOAD_MOSAICS',
            'namespace/LOAD_NAMESPACES',
            'restriction/LOAD_ACCOUNT_RESTRICTIONS',
            // wildcard authorizations
            'db/*',
            'diagnostic/*',
            'notification/*',
        ],
    };

    /// region public API
    /**
     * Construct a plugin service around an optional \a $app
     * Vue component/parent component.
     *
     * @param {Vue} $app
     */
    public constructor(protected readonly $app?: Vue) {}

    /**
     * This methods reads plugins from the local cache and tries
     * to find a plugin by its NPM module \a npmModule.
     *
     * @param   {string}    npmModule
     * @returns {PluginModel | null}
     */
    public findByModule(npmModule: string): PluginModel | null {
        const plugins = this.getPlugins();
        return plugins.find((p) => npmModule === p.npmModule);
    }

    /**
     * This method reads plugins from the local cache and returns
     * unique plugin entries by `npmModule`.
     *
     * @returns {PluginModel[]}
     */
    public getPlugins(): PluginModel[] {
        try {
            const allPlugins = this.pluginModelStorage.get() || [];
            return _.uniqBy(allPlugins, 'npmModule');
        } catch (e) {
            return [];
        }
    }

    /**
     * This method updates the plugins in the local cache. A
     * read is done first to determine the current state  of
     * the local cache. This method also filters plugins and
     * returns unique plugins by `npmModule`.
     *
     * Additionally, this method identifies the plugins that
     * are to be considered *uninstalled* because they don't
     * appear in the \a plugins anymore.
     *
     * @param   {PluginModel[]}     plugins
     * @returns {PluginModel[]}
     */
    public setPlugins(plugins: PluginModel[]): PluginModel[] {
        // read from database to identify uninstalls
        const fromStorage = this.getPlugins();
        const discovered = plugins.map((p) => p.npmModule);

        // check for manually uninstalled plugins
        let uninstalled = fromStorage.filter((p) => !discovered.includes(p.npmModule));

        // merge storage information with discovery
        const augmented = plugins
            .map((p) =>
                Object.assign(
                    // defaults prevail
                    {
                        status: PluginBridge.PluginInstallStatus.Installed,
                        createdAt: new Date().getTime(),
                    },

                    // then storage info
                    fromStorage.find((s) => s.npmModule === p.npmModule),

                    // then filesystem info
                    p,
                ),
            )
            // overwrite "uninstalled" storage status for discovered plugins
            .map((p) => (p.status === PluginBridge.PluginInstallStatus.Uninstalled ? { ...p, status: PluginBridge.PluginInstallStatus.Installed } : p));

        // set "uninstalled" flags
        uninstalled = uninstalled.map((p) =>
            Object.assign({}, p, {
                status: PluginBridge.PluginInstallStatus.Uninstalled,
                updatedAt: new Date().getTime(),
            }),
        );

        // update storage with newly discovered plugins
        const updated = _.uniqBy(augmented.concat(uninstalled), 'npmModule');
        //console.log('[PluginService.ts] Updating plugins with: ', updated);

        this.pluginModelStorage.set(updated);
        return updated;
    }

    /**
     * This method updates a plugin entry by \a npmModule module
     * and sets \a fields on the entry with previous values set.
     *
     * @param   {string}    npmModule
     * @returns {PluginModel[]}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    public updatePlugin(npmModule: string, fields: { [key: string]: any }): PluginModel[] {
        let updated = [];
        try {
            // determines if its an update or a create
            this.assertPluginExists(npmModule);

            // update one entry's "fields"
            updated = this.getPlugins().map((p) => {
                if (p.npmModule !== npmModule) {
                    return p;
                }
                return Object.assign(
                    {},

                    // storage info prevails
                    p,

                    // filesystem info overwrites
                    fields,
                );
            });
            //console.log('Performing update in DB with: ', updated);
        } catch (e) {
            // create new plugin entry
            let p = new PluginModel(npmModule);
            p = Object.assign({}, p, fields);

            updated = this.getPlugins().concat([p]);
            //console.log('Performing create in DB with: ', updated);
        }

        this.pluginModelStorage.set(updated);
        return updated;
    }

    /**
     * This method enables an installed plugin \a npmModule.
     *
     * After enabling a plugin for the first time, a link is
     * added in the left navigation bar and child routes are
     * then added with the Plugins Manager as their parent.
     *
     * @param   {string}    npmModule
     * @returns {PluginService}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     * @throws  {Error}     On invalid status for \a npmModule. Must be on of: 'installed', 'disabled'.
     */
    public enablePlugin(npmModule: string): PluginService {
        // check for presence
        this.assertPluginExists(npmModule);

        // can only enable if plugin installed or disabled
        this.assertPluginStatus(npmModule, [PluginBridge.PluginInstallStatus.Installed, PluginBridge.PluginInstallStatus.Disabled]);

        // enable plugin
        this.updatePlugin(npmModule, {
            status: 'enabled',
        });

        window['electron']['ipcRenderer'].send('onPluginEnabled', npmModule);
        return this;
    }

    /**
     * This method disables an installed plugin \a npmModule.
     *
     * @param   {string}    npmModule
     * @returns {PluginService}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     * @throws  {Error}     On invalid status for \a npmModule. Must be on of: 'installed', 'disabled'.
     */
    public disablePlugin(npmModule: string): PluginService {
        // check for presence
        this.assertPluginExists(npmModule);

        // can only disable if plugin enabled
        this.assertPluginStatus(npmModule, [PluginBridge.PluginInstallStatus.Enabled]);

        // enable plugin
        this.updatePlugin(npmModule, {
            status: 'disabled',
        });

        window['electron']['ipcRenderer'].send('onPluginDisabled', npmModule);
        return this;
    }

    /**
     * This method handles the initial setup of custom database tables
     * as used by plugins. A plugin can use {PluginBridge.PluginStorage}
     * objects to describe its database structure.
     *
     * This method must be called before any database operations can be
     * executed using the underlying custom tables and entries in them.
     *
     * @param   {string}                npmModule
     * @param   {PluginStorage[]}       storages
     * @returns {PluginService}
     */
    public initStorage(npmModule: string, storages: PluginBridge.PluginStorage[]): PluginService {
        // defers storage responsibility to DatabaseService
        const dbService = new DatabaseService(this.$app);

        for (let i = 0; i < storages.length; i++) {
            const storage = storages[i];

            // creates the table in localStorage
            dbService.createTable(npmModule, storage.storageKey, storage.primaryKey);
        }

        return this;
    }

    /**
     * This method initializes communication channels for plugins
     * to be able to send/receive messages from the main process.
     *
     * This method offers a dual communication flow with the help
     * of `onPluginActionRequest` and `onPluginActionResponse` as
     * those events permit to request data from the wallet inside
     * a plugin source code package.
     *
     * @param   {Vue}           $pluginBus
     * @param   {Vuex.Store}    storeImpl
     * @returns {PluginService}
     */
    public initPluginBus($pluginBus: Vue, { commit, dispatch, getters, rootGetters }): PluginService {
        // onPluginsReady: Dispatches initial *save* of plugins in database
        $pluginBus.$on('onPluginsReady', (plugins: PluginModel[]) => {
            dispatch('diagnostic/ADD_INFO', `onPluginsReady caught with ${plugins.length} plugins.`, {
                root: true,
            });

            // Updates plugin metadata (name, version, etc.)
            dispatch('SAVE_DISCOVERED_PLUGINS', plugins);
        });

        // onPluginLoaded: Dispatches *update* of plugin details in database (after load)
        $pluginBus.$on('onPluginLoaded', (plugin: PluginModel) => {
            dispatch('diagnostic/ADD_INFO', `onPluginLoaded caught for plugin ${plugin.npmModule}.`, {
                root: true,
            });

            // Updates plugin details (components, permissions, etc.)
            dispatch('SAVE_PLUGIN_DETAILS', plugin);

            // Initializes database tables if necessary
            if (plugin.storages && plugin.storages.length) {
                dispatch('INIT_PLUGIN_STORAGE', plugin);
            }
        });

        // onPluginActionRequest: Dispatches/Commits/Gets using app Vuex store
        $pluginBus.$on('onPluginActionRequest', async (actionPayload: PluginActionPayload) => {
            const currentPlugin = getters['currentPlugin'];

            dispatch(
                'diagnostic/ADD_INFO',
                `onPluginActionRequest caught for plugin ${currentPlugin.npmModule} and action ${actionPayload.action}`,
                {
                    root: true,
                },
            );

            const service = new PluginService();
            const response = await service.handleRequest(currentPlugin, actionPayload, {
                commit,
                dispatch,
                rootGetters,
            });

            $pluginBus.$emit('onPluginActionResponse', JSON.stringify(Object.assign({}, actionPayload, { response: response })));
            dispatch(
                'diagnostic/ADD_INFO',
                `onPluginActionResponse emitted for plugin ${currentPlugin.npmModule} and action ${actionPayload.action}`,
                {
                    root: true,
                },
            );
        });

        // onBeforeRecipeUploaded: Dispatches pre-installation hook for plugins
        // $pluginBus.$on('onBeforeRecipeUploaded', (recipeJson: string) => {
        //     console.log(`[DEBUG][PluginService] onBeforeRecipeUploaded caught with recipe: ${recipeJson}`)
        //     commit('currentRecipeStatus', PluginRecipeStatus.Pending);
        //     commit('currentRecipeDuration', 0);
        // });

        // // onRecipeUploaded: Dispatches status update when dApp recipe upload completed
        // $pluginBus.$on('onRecipeUploaded', (buildNumber: any) => {
        //     dispatch('diagnostic/ADD_INFO', `onRecipeUploaded caught with build number ${buildNumber}.`, {
        //         root: true,
        //     });

        //     commit('currentRecipeStatus', PluginRecipeStatus.Uploaded);
        //     //commit('currentRecipeDuration', parseInt(uploadResult.estimatedDuration));
        // });

        // // onRecipeBuildError: Dispatches error handler hook for plugins
        // $pluginBus.$on('onRecipeBuildError', (error: string) => {
        //     dispatch('diagnostic/ADD_ERROR', `onRecipeBuildError caught with ${error}.`, {
        //         root: true,
        //     });

        //     commit('currentRecipeStatus', PluginRecipeStatus.Error);
        // });

        // // onRecipeBuildCompleted: Dispatches post-build hook for plugins
        // $pluginBus.$on('onRecipeBuildCompleted', (artifactFile: string) => {
        //     dispatch('diagnostic/ADD_INFO', `onRecipeBuildCompleted caught with artifact ${artifactFile}.`, {
        //         root: true,
        //     });

        //     commit('currentRecipeStatus', PluginRecipeStatus.Success);
        //     commit('currentRecipeArtifact', `http://dapps.dhealth.cloud/artifacts/${artifactFile}`);
        // });

        // // onRecipeBuildUpdated: Dispatches build status update hook
        // $pluginBus.$on('onRecipeBuildUpdated', (buildUpdate: any) => {
        //     if (buildUpdate.status === 'BUILDING') {
        //         commit('currentRecipeStatus', PluginRecipeStatus.Building);
        //         commit('currentRecipeDuration', buildUpdate.estimateDuration);
        //     }
        // });

        // // onRecipeBuildTimeout: Dispatches build timeout hook
        // $pluginBus.$on('onRecipeBuildTimeout', () => (buildNumber: number) => {
        //     // forwarded as onRecipeBuildError
        //     $pluginBus.$emit(
        //         'onRecipeBuildError',
        //         `dApp Recipe build #${buildNumber} failed to execute and timed out.`,
        //     );
        // });

        return this;
    }

    /**
     * This method handles a plugin's action request \a actionSpec
     * and returns a response directly from store.
     *
     * After checking the plugin status, which must be set enabled
     * it will check for granted permissions and about the payload
     * syntax in \a actionPayload.
     *
     * At last, the method will dispatch / commit / get the action
     * / mutation / getter from the \a storeImpl implementation of
     * the Vuex store.
     *
     * @param   {PluginModel}           currentPlugin
     * @param   {PluginActionPayload}   actionPayload
     * @param   {MinimalVuexStoreImpl}  storeImpl
     * @return  {any}                   The resolved store action/mutation/getter response.
     * @throws  {Error}                 On invalid \a npmModule, not found in local cache.
     * @throws  {Error}                 On invalid plugin status. Must be "enabled" first.
     * @throws  {Error}                 On missing permission grant. This is an error of the plugin.
     * @throws  {Error}                 On invalid action payload in \a actionPayload.
     */
    public async handleRequest(
        currentPlugin: PluginModel,
        actionPayload: PluginActionPayload,
        storeImpl: MinimalVuexStoreImpl,
    ): Promise<any> {
        const plugin = this.getPluginOrFail(actionPayload.plugin);

        // checks "authentication" of plugin
        if (currentPlugin.npmModule !== actionPayload.plugin) {
            //console.log(`[ERR][store/Plugin.ts] Plugin action request denied. Reason: Plugin must be started.`);
            throw new Error(`PluginActionRequestError: Plugin must be started`);
        }

        // checks plugin status (must be enabled)
        if (PluginBridge.PluginInstallStatus.Enabled !== plugin.status) {
            //console.log(`[ERR][store/Plugin.ts] Plugin action request denied. Reason: Plugin must be enabled.`);
            throw new Error(`PluginActionRequestError: Plugin must be enabled`);
        }

        // checks that permission(s) is/are granted
        if (!plugin.permissions.find((perm) => actionPayload.action === perm.target)) {
            //console.log(`[ERR][store/Plugin.ts] Plugin action request denied. Reason: Permission not granted for ${actionPayload.action}.`);
            throw new Error(`PluginActionRequestError: Permission must be granted`);
        }

        // checks that the action request is valid
        if (!actionPayload || !('plugin' in actionPayload) || !('type' in actionPayload)) {
            //console.log(`[ERR][store/Plugin.ts] Plugin action request denied. Reason: Invalid action payload.`);
            throw new Error(`PluginActionRequestError: Action payload must be valid`);
        }

        // checks that the action/mutation/getter is not blacklisted
        this.assertRequestAllowance(actionPayload.type, actionPayload.action);

        let response = undefined;
        //console.log(`[INFO][store/Plugin.ts] reading ${actionPayload.type}: ${actionPayload.action} from store`);

        // using Vuex rootGetters (namespaced)
        if ('getter' === actionPayload.type) {
            response = storeImpl.rootGetters[actionPayload.action];
        }
        // using Vuex store action (dispatch)
        else if ('action' === actionPayload.type) {
            response = await storeImpl.dispatch(
                actionPayload.action,
                Object.assign({}, { plugin: currentPlugin.npmModule }, actionPayload.args),
                { root: true },
            );
        }
        // using Vuex store mutation (commit)
        else if ('mutation' === actionPayload.type) {
            response = storeImpl.commit(actionPayload.action, actionPayload.args);
        }

        return response;
    }

    /**
     * This method searches for a module in NPM. It dispatches the
     * search using pacote internally, which is also used by NPM.
     *
     * Also, dependencies are read from the package.json file  and
     * the presence of obligatory dependencies are evaluated.
     *
     * @param npmModule
     */
    // public async searchModule(npmModule: string, version: string = 'latest'): Promise<PluginSearchResponse> {
    //     return new Promise(async (resolve, reject) => {
    //         // only plugins from authorized publishers are accepted
    //         if (!this.KNOWN_PUBLISHERS.some((p) => npmModule.startsWith(p))) {
    //             return reject(`This plugin is from an unauthorized publisher.`);
    //         }

    //         // prepares the package.json download URL
    //         const unpkgUrl = `https://unpkg.com/${npmModule}@${version}/package.json`;

    //         // downloads package.json using unpkg
    //         const response = await fetch(unpkgUrl, {
    //             method: 'GET',
    //         }).then((response) => response.text());

    //         // reads package manifest (package.json)
    //         let packageJson = { dependencies: [] };
    //         try {
    //             packageJson = JSON.parse(response);
    //         } catch (e) {
    //             return reject(`An error happened while parsing package.json`);
    //         }

    //         // mandatory presence
    //         if (!('dependencies' in packageJson)) {
    //             return reject(`Missing dependencies in package.json`);
    //         }

    //         // check for obligatory deps
    //         const dependencies = Object.keys(packageJson.dependencies);

    //         if (!dependencies.includes('@dhealth/wallet-api-bridge') || !dependencies.includes('@dhealth/wallet-components')) {
    //             return reject(`Missing mandatory dependencies`);
    //         }

    //         return resolve({
    //             npmModule,
    //             isCompatible: true,
    //         });
    //     });
    // }

    /**
     * This method emits a `onPluginInstallRequest` event to
     * the main process. This event, if authorized, will set
     * up the new plugin using a public Jenkins build  which
     * can then be downloaded and installed by the user.
     *
     * @emits ipcRenderer:onPluginInstallRequest
     * @param   {string[]}    selectedPlugins
     * @returns {PluginService}
     */
    // public createRecipe(selectedPlugins: string[]): PluginService {
    //     // Merges storage plugins and selected new plugins
    //     const installedPlugins = this.getPlugins();
    //     const recipePlugins = installedPlugins.concat(selectedPlugins.map(
    //         n => new PluginModel(n, undefined, 'latest')
    //     ));

    //     console.log(`[DEBUG][PluginService.ts] ${installedPlugins.length} installedPlugins.`)
    //     console.log(`[DEBUG][PluginService.ts] ${recipePlugins.length} recipePlugins.`)

    //     // Builds recipe from plugin instances
    //     const recipe = {};
    //     recipePlugins.forEach(p => recipe[p.npmModule] = p.version ?? 'latest');

    //     console.log(`[DEBUG][PluginService.ts] Sending install request with recipe: ${JSON.stringify(recipe)}.`)

    //     // Emits onPluginsInstallRequest to main process
    //     window['electron']['ipcRenderer'].send('onPluginsInstallRequest', JSON.stringify(recipe));
    //     return this;
    // }
    /// end-region public API

    /// region protected API
    /**
     * This method throws an error if the \a npmModule can't
     * be found in the database and otherwise will return an
     * instance of {PluginModel}.
     *
     * @param   {string}    npmModule
     * @returns {PluginModel}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    protected getPluginOrFail(npmModule: string): PluginModel {
        const plugin = this.findByModule(npmModule);

        // check for presence
        if (!plugin) {
            throw new Error('Plugin not found: ' + npmModule);
        }

        return plugin;
    }

    /**
     * This method throws an error if the \a npmModule can't
     * be found in the database.
     *
     * @param   {string}    npmModule
     * @returns {PluginService}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    protected assertPluginExists(npmModule: string): PluginService {
        const plugin = this.findByModule(npmModule);

        // check for presence
        if (!plugin) {
            throw new Error('Plugin not found: ' + npmModule);
        }

        return this;
    }

    /**
     * This method throws an error if the \a npmModule has a
     * status that *cannot* be found in \a statuses.
     *
     * @param   {string}    npmModule
     * @returns {PluginService}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    protected assertPluginStatus(npmModule: string, statuses: PluginBridge.PluginInstallStatus[]): PluginService {
        const plugin = this.findByModule(npmModule);

        // check for statuses
        if (!statuses.includes(plugin.status)) {
            throw new Error('Invalid plugin status for: ' + npmModule);
        }

        return this;
    }

    /**
     * This method throws an error if the \a type of request
     * is generally blacklisted and \a target request is not
     * whitelisted.
     *
     * @param   {string}    npmModule
     * @returns {PluginService}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    protected assertRequestAllowance(type: string, target: string): PluginService {
        // backlist/whitelist as defined in this class
        const blacklist = type in this.BLACKLISTS ? this.BLACKLISTS[type] : [];
        const whitelist = type in this.WHITELISTS ? this.WHITELISTS[type] : [];

        // whether we have wildcard allowance/denial
        const isWildcardDenial = blacklist.length === 1 && blacklist[0] === '*';
        const isWildcardAllow = whitelist.length === 1 && whitelist[0] === '*';

        // manual allowance
        const isWhitelisted =
            whitelist.includes(target) ||
            (!isWildcardAllow && whitelist.find((w) => w.endsWith('*') && target.startsWith(w.substr(0, w.length - 1))));

        // manual denial
        const isBlacklisted =
            blacklist.includes(target) ||
            (!isWildcardDenial && blacklist.find((b) => b.endsWith('*') && target.startsWith(b.substr(0, b.length - 1))));

        // checks that the action/mutation/getter is not blacklisted
        if ((isWildcardDenial && !isWhitelisted) || isBlacklisted) {
            //console.log(`[ERR][store/Plugin.ts] Plugin action request denied. Reason: Action target is blacklisted.`);
            throw new Error(`PluginActionRequestError: Action target is blacklisted`);
        }

        return this;
    }
    /// end-region protected API
}
