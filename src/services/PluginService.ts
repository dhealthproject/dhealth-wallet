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
import { PluginBridge } from '@yourdlt/wallet-api-bridge';

import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage';
import { PluginModelStorage } from '@/core/database/storage/PluginModelStorage';
import { VersionedModel } from '@/core/database/entities/VersionedModel';
import { PluginModel } from '@/core/database/entities/PluginModel';

export class PluginService {
    /**
     * The plugins information local cache.
     * @note The database uses a singleton pattern.
     * @var  {PluginModelStorage}
     */
    private readonly pluginModelStorage = PluginModelStorage.INSTANCE;

    /// region static API
    /**
     * This method *globally registers* component to make them
     * available to a Vue instance that created afterwards. It
     * is important to call this method *before* creating  the
     * new instance and before rendering of the instance.
     *
     * @returns {number}    The number of components attached.
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    // public static attachComponents(): number {
    //     const plugins = new PluginService().getPlugins();
    //     const attached = [];

    //     // register components of enabled plugins
    //     for (const i in plugins) {
    //         const plugin = plugins[i];

    //         // registering only for enabled plugins
    //         if (plugin.status !== PluginBridge.PluginInstallStatus.Enabled) {
    //             continue;
    //         }

    //         console.log('found enabled plugin: ', plugin.npmModule);

    //         // register individual components
    //         const components = Object.keys(plugin.components);
    //         components.forEach((c: string) => {
    //             console.log('registering component: ', c, plugin.components[c]);
    //             Vue.component(c, plugin.components[c]);
    //             attached.push(c);
    //         });
    //     }

    //     return attached.length;
    // }

    /**
     *
     * @param npmModule
     * @returns {number}    The number of components detached.
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    // public static detachComponents(npmModule: string): number {
    //     const plugin = new PluginService().getPluginOrFail(npmModule);
    //     const components = Object.keys(plugin.components);

    //     return components.length;
    // }
    /// end-region static API

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
     * This method instantiates a {SimpleObjectStorage} object
     * around a {VersionedModel} with type described by the \a
     * model.
     *
     * The database table name can be customized using  the \a
     * storageKey.
     *
     * @param   {string}    storageKey
     * @param   {object}    model
     * @returns {SimpleObjectStorage<any>}
     */
    public getStorage(storageKey: string, model: any): SimpleObjectStorage<any> {
        return new SimpleObjectStorage<VersionedModel<typeof model[]>>(storageKey);
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
     * @returns {PluginService}
     */
    public setPlugins(plugins: PluginModel[]): PluginService {
        // read from database to identify uninstalls
        const fromStorage = this.getPlugins();
        const discovered = plugins.map((p) => p.npmModule);

        // check for manually uninstalled plugins
        let uninstalled = fromStorage.filter((p) => !discovered.includes(p.npmModule));

        // merge storage information with discovery
        const augmented = plugins.map((p) =>
            Object.assign(
                // defaults prevail
                {
                    status: 'installed',
                    createdAt: new Date().getTime(),
                },
                // then storage info
                fromStorage.find((s) => s.npmModule === p.npmModule),
                // then *discovered* info
                p,
            ),
        );

        // set "uninstalled" flags
        uninstalled = uninstalled.map((p) =>
            Object.assign({}, p, {
                status: PluginBridge.PluginInstallStatus.Uninstalled,
                updatedAt: new Date().getTime(),
            }),
        );

        // update storage with newly discovered plugins
        const updated = _.uniqBy(augmented.concat(uninstalled), 'npmModule');
        console.log('Updating plugins with: ', updated);

        this.pluginModelStorage.set(updated);
        return this;
    }

    /**
     * This method updates a plugin entry by \a npmModule module
     * and sets \a fields on the entry with previous values set.
     *
     * @param   {string}    npmModule
     * @returns {PluginService}
     * @throws  {Error}     On invalid \a npmModule, not found in local cache.
     */
    public updatePlugin(npmModule: string, fields: { [key: string]: any }): PluginService {
        // check for presence
        this.assertPluginExists(npmModule);

        // update one entry's "fields"
        const updated = this.getPlugins().map((p) => {
            if (p.npmModule !== npmModule) {
                return p;
            }
            return Object.assign({}, p, fields);
        });

        console.log('Performing update of DB with: ', updated);
        this.pluginModelStorage.set(updated);
        return this;
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
        return this.updatePlugin(npmModule, {
            status: 'enabled',
        });
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
        return this.updatePlugin(npmModule, {
            status: 'disabled',
        });
    }
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
    /// end-region protected API
}
