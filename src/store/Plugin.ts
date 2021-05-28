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
import { PluginService } from '@/services/PluginService';
import { AwaitLock } from './AwaitLock';
import { $pluginBus } from '../events';

/// region globals
const Lock = AwaitLock.create();
/// end-region globals

/// region state
interface PluginState {
    initialized: boolean;
    plugins: PluginModel[];
    currentPlugin: PluginModel;
}

const initialState: PluginState = {
    initialized: false,
    plugins: [],
    currentPlugin: null,
};
/// end-region state

/// region exported store
export default {
    namespaced: true,
    state: initialState,
    getters: {
        getInitialized: (state) => state.initialized,
        plugins: (state: PluginState) => state.plugins,
        currentPlugin: (state: PluginState) => state.currentPlugin,
    },
    mutations: {
        setInitialized: (state, initialized) => (state.initialized = initialized),
        plugins: (state, plugins) => Vue.set(state, 'plugins', plugins),
        currentPlugin: (state: PluginState, pluginModel: PluginModel) => {
            state.currentPlugin = pluginModel;
        },
    },
    actions: {
        async initialize({ commit, dispatch, getters }) {
            const callback = async () => {
                console.log('[DEBUG][store/Plugins.ts] initializing $pluginBus onPluginsReady handler');

                // onPluginsReady
                $pluginBus.$on('onPluginsReady', (plugins: PluginModel[]) => {
                    console.log('[INFO][store/Plugin.ts] caught onPluginsReady: ', plugins);
                    dispatch('SAVE_DISCOVERED_PLUGINS', [
                        ...plugins.map((p) => ({
                            ...p,
                        })),
                    ]);
                });

                // update store
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
            const plugins = await new PluginService().getPlugins();
            commit('plugins', plugins);
        },

        async SAVE_DISCOVERED_PLUGINS({ commit }, plugins) {
            await new PluginService().setPlugins(plugins);
            commit('plugins', plugins);
        },

        async UPDATE_CACHE({ commit, dispatch }, plugins) {
            dispatch('diagnostic/ADD_DEBUG', 'Store action plugin/UPDATE_PLUGINS dispatched with ' + plugins.length + ' plugins', {
                root: true,
            });

            // first update entries cache
            commit('plugins', plugins);
        },
    },
};
/// end-region exported store
