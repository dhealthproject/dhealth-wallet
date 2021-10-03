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
    registryPlugins: PluginModel[];
}

const initialState: PluginState = {
    initialized: false,
    listedPlugins: [],
    currentPlugin: null,
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
        registryPlugins: (state: PluginState) => state.registryPlugins,
    },
    mutations: {
        setInitialized: (state, initialized) => (state.initialized = initialized),
        listedPlugins: (state, listedPlugins) => (state.listedPlugins = listedPlugins),
        currentPlugin: (state: PluginState, pluginModel: PluginModel) => (state.currentPlugin = pluginModel),
        registryPlugins: (state, registryPlugins) => Vue.set(state, 'registryPlugins', registryPlugins),
    },
    actions: {
        async initialize({ commit, dispatch, getters, rootGetters }) {
            const callback = async () => {
                // loads installed plugins from database
                dispatch('LOAD_PLUGINS');

                // initializes all communication channels for plugins
                new PluginService().initPluginBus($pluginBus, { commit, dispatch, getters, rootGetters });

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

        SET_CURRENT_PLUGIN({ commit, dispatch, getters }, npmModule: string) {
            dispatch('diagnostic/ADD_DEBUG', `Store action plugin/SET_CURRENT_PLUGIN dispatched with ${npmModule}`, {
                root: true,
            });

            // set current plugin
            const plugins = getters['listedPlugins'];
            commit('currentPlugin', plugins.find(p => p.npmModule === npmModule));
        },

        RESET_PLUGINS({ commit }) {
            commit('currentPlugin', null);
        },

        LOAD_PLUGINS({ dispatch, commit }) {
            dispatch('diagnostic/ADD_DEBUG', `Store action plugin/LOAD_PLUGINS dispatched`, {
                root: true,
            });

            const listedPlugins = new PluginService().getPlugins();
            commit('listedPlugins', [...listedPlugins]);
        },

        INIT_PLUGIN_STORAGE({ dispatch }, plugin) {
            dispatch('diagnostic/ADD_DEBUG', `Store action plugin/INIT_PLUGIN_STORAGE dispatched with ${plugin.npmModule}`, {
                root: true,
            });

            const service = new PluginService();
            service.initStorage(plugin.npmModule, plugin.storages);
            dispatch('db/LOAD_CUSTOM_TABLES', null, { root: true });
        },

        SAVE_DISCOVERED_PLUGINS({ dispatch, commit }, listedPlugins) {
            dispatch('diagnostic/ADD_DEBUG', `Store action plugin/SAVE_DISCOVERED_PLUGINS dispatched with ${listedPlugins.length} plugins`, {
                root: true,
            });

            const updatedPlugins = new PluginService().setPlugins(listedPlugins);
            commit('listedPlugins', [...updatedPlugins]);
        },

        SAVE_PLUGIN_DETAILS({ dispatch, commit }, plugin) {
            dispatch('diagnostic/ADD_DEBUG', `Store action plugin/SAVE_PLUGIN_DETAILS dispatched with ${plugin.npmModule}`, {
                root: true,
            });

            const updatedPlugins = new PluginService().updatePlugin(plugin.npmModule, plugin);
            commit('listedPlugins', [...updatedPlugins]);
        },
    },
};
/// end-region exported store
