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
import { $eventBus } from '../events';
import { AwaitLock } from './AwaitLock';

/// region globals
const Lock = AwaitLock.create();
/// end-region globals

/// region state
interface PluginState {
    initialized: boolean;
    plugins: PluginModel[];
    isLoadingPlugins: boolean;
}

const initialState: PluginState = {
    initialized: false,
    plugins: [],
    isLoadingPlugins: false,
};
/// end-region state

/// region exported store
export default {
    namespaced: true,
    state: initialState,
    getters: {
        getInitialized: (state) => state.initialized,
        plugins: (state: PluginState) => state.plugins,
    },
    mutations: {
        setInitialized: (state, initialized) => (state.initialized = initialized),
        plugins: (state, plugins) => Vue.set(state, 'plugins', plugins),
    },
    actions: {
        async initialize({ commit, dispatch, getters }) {
            const callback = async () => {
                console.log('[DEBUG][store/Plugins.ts] initializing $eventBus onPluginsReady handler');

                // onPluginsReady
                $eventBus.$on('onPluginsReady', (plugins: PluginModel[]) => {
                    console.log('[INFO][store/Plugin.ts] caught onPluginsReady: ', plugins);
                    dispatch('SAVE_PLUGINS', [
                        ...plugins.map((p) => ({
                            ...p,
                            discoveredAt: new Date().getTime(),
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
        RESET_PLUGINS({ commit }) {
            commit('plugins', []);
        },

        async LOAD_PLUGINS({ commit }) {
            const plugins = await new PluginService().getPlugins();
            commit('plugins', plugins);
        },

        async SAVE_PLUGINS({ commit }, plugins) {
            console.log('[INFO][store/Plugin.ts] saving plugins: ', plugins);
            await new PluginService().savePlugins(plugins);
            commit('plugins', plugins);
        },
    },
};
/// end-region exported store
