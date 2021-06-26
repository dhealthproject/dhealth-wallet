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

// internal dependencies
import { PluginModel } from '@/core/database/entities/PluginModel';
import { PluginService, PluginRecipeStatus } from '@/services/PluginService';
import { AwaitLock } from './AwaitLock';
import { $pluginBus } from '../events';

// configuration
import { pluginsConfig } from '@/config';

/// region globals
const Lock = AwaitLock.create();
/// end-region globals

/// region state
interface PluginState {
    initialized: boolean;
    listedPlugins: PluginModel[];
    currentPlugin: PluginModel;
    currentRecipeStatus: PluginRecipeStatus;
    currentRecipeDuration: number;
    registryPlugins: PluginModel[];
}

const initialState: PluginState = {
    initialized: false,
    listedPlugins: [],
    currentPlugin: null,
    currentRecipeStatus: undefined,
    currentRecipeDuration: 0,
    registryPlugins: pluginsConfig.registryPlugins,
};
/// end-region state

/// region exported store
export default {
    namespaced: true,
    state: initialState,
    getters: {
        getInitialized: (state) => state.initialized,
        listedPlugins: (state: PluginState) => state.listedPlugins,
        currentPlugin: (state: PluginState) => state.currentPlugin,
        currentRecipeStatus: (state: PluginState) => state.currentRecipeStatus,
        currentRecipeDuration: (state: PluginState) => state.currentRecipeDuration,
        registryPlugins: (state: PluginState) => state.registryPlugins,
    },
    mutations: {
        setInitialized: (state, initialized) => (state.initialized = initialized),
        listedPlugins: (state, listedPlugins) => Vue.set(state, 'listedPlugins', listedPlugins),
        currentPlugin: (state: PluginState, pluginModel: PluginModel) => {
            state.currentPlugin = pluginModel;
        },
        currentRecipeStatus: (state: PluginState, status: PluginRecipeStatus) => {
            state.currentRecipeStatus = status;
        },
        currentRecipeDuration: (state: PluginState, duration: number) => {
            state.currentRecipeDuration = duration;
        },
        registryPlugins: (state, registryPlugins) => Vue.set(state, 'registryPlugins', registryPlugins),
    },
    actions: {
        async initialize({ commit, dispatch, getters, rootGetters }) {
            const callback = async () => {
                // initializes all communication channels for plugins
                new PluginService().initPluginBus($pluginBus, { commit, dispatch, getters, rootGetters });

                // loads installed plugins from database
                await dispatch('LOAD_PLUGINS');

                // done
                commit('setInitialized', true);
            };

            // acquire async lock until initialized
            await Lock.initialize(callback, { getters });
        },
        async uninitialize({ commit, getters }) {
            const callback = async () => {
                commit('setInitialized', false);
            };
            await Lock.uninitialize(callback, { getters });
        },

        async SET_CURRENT_PLUGIN({ commit, dispatch }, currentPlugin: PluginModel) {
            dispatch('diagnostic/ADD_DEBUG', 'Store action plugin/SET_CURRENT_PLUGIN dispatched with ' + currentPlugin.npmModule, {
                root: true,
            });

            // set current plugin
            commit('currentPlugin', currentPlugin);
        },

        RESET_PLUGINS({ commit }) {
            commit('currentPlugin', null);
        },

        async LOAD_PLUGINS({ commit }) {
            const listedPlugins = await new PluginService().getPlugins();
            commit('listedPlugins', listedPlugins);
        },

        async SAVE_DISCOVERED_PLUGINS({ commit }, listedPlugins) {
            console.log('SAVE_DISCOVERED: ', listedPlugins);
            await new PluginService().setPlugins(listedPlugins);
            commit('listedPlugins', listedPlugins);
        },

        async ADD_DISCOVERED_PLUGIN({ commit }, plugin) {
            const service = new PluginService();
            const plugins = await service.getPlugins();
            const exists = service.findByModule(plugin.npmModule);

            if (!!exists) {
                await service.updatePlugin(
                    plugin.npmModule,
                    Object.assign(
                        {},
                        {
                            ...plugin,
                        },
                        { status: 'installed' },
                    ),
                );
            } else {
                await service.setPlugins(
                    plugins.concat(
                        Object.assign(
                            {},
                            {
                                ...plugin,
                            },
                            { status: 'installed' },
                        ),
                    ),
                );
            }
            commit('listedPlugins', await service.getPlugins());
        },

        INIT_PLUGIN_STORAGE({ dispatch }, plugin) {
            dispatch('diagnostic/ADD_DEBUG', `Store action plugin/INIT_PLUGIN_STORAGE dispatched with ${plugin.npmModule}`, {
                root: true,
            });

            const service = new PluginService();
            service.initStorage(plugin.npmModule, plugin.storages);
            dispatch('LOAD_CUSTOM_TABLES', null, { root: true });
        },

        async SAVE_PLUGIN_DETAILS({ dispatch }, plugin) {
            await new PluginService().updatePlugin(plugin.npmModule, plugin);
            await dispatch('LOAD_PLUGINS');
        },

        async UPDATE_CACHE({ commit, dispatch }, listedPlugins) {
            dispatch('diagnostic/ADD_DEBUG', 'Store action plugin/UPDATE_CACHE dispatched with ' + listedPlugins.length + ' plugins', {
                root: true,
            });

            // first update entries cache
            commit('listedPlugins', listedPlugins);
        },
    },
};
/// end-region exported store
