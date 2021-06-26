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
import { AwaitLock } from './AwaitLock';
import { DatabaseService, DatabaseActionPayload } from '@/services/DatabaseService';
import { DatabaseTableModel } from '@/core/database/entities/DatabaseTableModel';
import { DatabaseTableEntryModel } from '@/core/database/entities/DatabaseTableEntryModel';

/// region globals
const Lock = AwaitLock.create();
/// end-region globals

/// region state
interface DatabaseState {
    initialized: boolean;
    tables: DatabaseTableModel[];
    entries: DatabaseTableEntryModel[];
}

const initialState: DatabaseState = {
    initialized: false,
    tables: [],
    entries: [],
};
/// end-region state

export default {
    namespaced: true,
    state: initialState,
    getters: {
        getInitialized: (state) => state.initialized,
        tables: (state: DatabaseState) => state.tables,
        entries: (state: DatabaseState) => state.entries,
    },
    mutations: {
        setInitialized: (state, initialized) => {
            state.initialized = initialized;
        },
        tables: (state, tables) => Vue.set(state, 'tables', tables),
        entries: (state, entries) => Vue.set(state, 'entries', entries),
    },
    actions: {
        async initialize({ commit, getters }) {
            const callback = async () => {
                // MIGRATIONS COULD GO HERE!
                commit('setInitialized', true);
            };

            // aquire async lock until initialized
            await Lock.initialize(callback, { getters });
        },
        async uninitialize({ commit, getters }) {
            const callback = async () => {
                commit('setInitialized', false);
            };
            await Lock.uninitialize(callback, { getters });
        },

        async LOAD_CUSTOM_TABLES({ commit }) {
            const service = new DatabaseService();
            const tables = service.getTables();
            const entries = service.getEntries(/* no-filter */);
            commit('tables', tables);
            commit('entries', entries);
        },

        SELECT(ignored, payload: DatabaseActionPayload) {
            console.log('[DEBUG][store/Database.ts] caught db/SELECT with payload: ', payload);

            // read operation
            const service = new DatabaseService();
            const entries = service.getEntries(payload.plugin, payload.table, payload.data);

            console.log('[DEBUG][store/Database.ts] entries for db/SELECT: ', entries);
            return entries;
        },

        INSERT({ commit }, payload: DatabaseActionPayload) {
            console.log('[DEBUG][store/Database.ts] caught db/INSERT with payload: ', payload);

            // insert operation
            const service = new DatabaseService();
            service.insertEntry(payload.plugin, payload.table, payload.data);

            // update state
            commit('entries', service.getEntries());
        },

        UPDATE({ commit }, payload: DatabaseActionPayload) {
            console.log('[DEBUG][store/Database.ts] caught db/UPDATE with payload: ', payload);

            // insert operation
            const service = new DatabaseService();
            service.updateEntry(payload.plugin, payload.table, payload.data);

            // update state
            commit('entries', service.getEntries());
        },

        DELETE(ignored, payload: DatabaseActionPayload) {
            console.log('[DEBUG][store/Database.ts] caught db/DELETE with payload: ', payload);
        },
    },
};
