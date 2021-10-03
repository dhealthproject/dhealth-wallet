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

import { SimpleObjectStorage } from '@/core/database/backends/SimpleObjectStorage';
import { DatabaseTableModelStorage } from '@/core/database/storage/DatabaseTableModelStorage';
import { DatabaseTableEntryModelStorage } from '@/core/database/storage/DatabaseTableEntryModelStorage';
import { VersionedModel } from '@/core/database/entities/VersionedModel';
import { DatabaseTableModel } from '@/core/database/entities/DatabaseTableModel';
import { DatabaseTableEntryModel } from '@/core/database/entities/DatabaseTableEntryModel';

/**
 * @enum {DatabaseOperation}
 * @description Enumeration that holds possible values for database
 * operations. These define the types of operations that can be run
 * from inside a plugin.
 * It is intentionally prohibited to create tables other than by an
 * export in the plugin's main entry point.
 */
export enum DatabaseOperation {
    Select = 'select',
    Insert = 'insert',
    Update = 'update',
    Delete = 'delete',
}

/**
 * @type {DatabaseValueDictionary}
 * @description This type describes a dictionary of key-values
 * with potential arrays of scalar values.
 */
export type DatabaseValueDictionary = {
    [key: string]: PluginBridge.ScalarValueType;
};

/**
 * @interface {DatabaseActionPayload}
 * @description This interface defines database action payloads
 */
export interface DatabaseActionPayload {
    plugin: string;
    table: string;
    operation: DatabaseOperation;
    data: DatabaseValueDictionary;
}

/**
 * @class {DatabaseService}
 * @description This service class provides methods to handle tables
 * validation and state changes.
 */
export class DatabaseService {
    /**
     * The database tables information local cache.
     * @note The database uses a singleton pattern.
     * @var  {DatabaseTableModelStorage}
     */
    private readonly tableModelStorage = DatabaseTableModelStorage.INSTANCE;

    /**
     * The database table entries information local cache.
     * @note The database uses a singleton pattern.
     * @var  {DatabaseTableEntryModelStorage}
     */
    private readonly entryModelStorage = DatabaseTableEntryModelStorage.INSTANCE;

    /// region public API
    /**
     * Construct a plugin service around an optional \a $app
     * Vue component/parent component.
     *
     * @param {Vue} $app
     */
    public constructor(protected readonly $app?: Vue) {}

    /**
     * This method returns a namespaced table name as reflected
     * in localStorage. The NPM module and table name are joined
     * using `::`.
     *
     * @param   {string}    npmModule
     * @param   {string}    tableName
     * @returns {string}
     */
    public getTableName(npmModule: string, tableName: string): string {
        return [npmModule, '::', tableName].join('');
    }

    /**
     * This method reads tables from the local cache and tries
     * to find a table by its pair of NPM module \a npmModule and
     * \a tableName.
     *
     * @param   {string}    npmModule
     * @param   {string}    tableName
     * @returns {DatabaseTableModel | null}
     */
    public findTable(npmModule: string, tableName: string): DatabaseTableModel | null {
        const tables = this.getTables();
        return tables.find((p) => npmModule === p.npmModule && tableName === p.tableName);
    }

    /**
     * This methods reads entries from the local cache and tries
     * to find an entry by its triplet of NPM module \a npmModule,
     * \a tableName and \a identifier. The \a identifier is used
     * to identify singular entries in the database table.
     *
     * @param   {string}    npmModule
     * @param   {string}    tableName
     * @param   {string}    identifier
     * @returns {DatabaseTableEntryModel | null}
     */
    public findEntry(npmModule: string, tableName: string, identifier: string): DatabaseTableEntryModel | null {
        const entries = this.getEntries(npmModule, tableName);
        return entries.find((e) => identifier === e.identifier);
    }

    /**
     * This method reads tables from the local cache and returns
     * unique table names prefixed with the module identifier.
     *
     * @returns {DatabaseTableModel[]}
     */
    public getTables(): DatabaseTableModel[] {
        try {
            const allTables = this.tableModelStorage.get() || [];
            // uses namespaced table names using module identifier
            return _.uniqBy(allTables, (e) => [e.npmModule, '::', e.tableName].join(''));
        } catch (e) {
            return [];
        }
    }

    /**
     * This method reads entries from the local cache and returns
     * the database table entries.  This method returns only rows
     * for the requested module custom database table.
     *
     * This method is used when plugins issue action requests with
     * `db/SELECT`. Uniqueness of resulting entries is determined
     * using a triplet of \a npmModule, \a tableName and an entry's
     * identifier field value a stored in the `identifier` prop.
     *
     * @param   {string}    npmModule
     * @param   {string}    tableName
     * @returns {DatabaseTableEntryModel[]}
     */
    public getEntries(npmModule?: string, tableName?: string, filters?: DatabaseValueDictionary): DatabaseTableEntryModel[] {
        try {
            let allEntries = this.entryModelStorage.get() || [];
            allEntries = _.uniqBy(allEntries, (e) => [e.npmModule, '::', e.tableName, '::', e.identifier].join(''));

            // apply database filters
            if (!!filters && Object.keys(filters).length) {
                // filters work on a per-field basis (all must be equal)
                allEntries = allEntries.filter((entry) => !Object.keys(filters).filter((f) => entry[f] !== filters[f]).length);
            }

            if (!!npmModule && !!tableName) {
                // uses namespaced table names using module identifier and entry identifier
                // then returns only the entries for the requested module custom table
                return allEntries.filter((e) => e.npmModule === npmModule && e.tableName === tableName);
            }

            return allEntries;
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
     * This method inserts a new table described by \a npmModule, \a tableName
     * and \a primaryKey primary key field name.
     *
     * This method *must* be executed at least once before data can be stored
     * in the resulting custom database table (using db/INSERT).
     *
     * @param   {string}                npmModule
     * @param   {string}                tableName
     * @param   {string}                primaryKey
     * @returns {DatabaseTableModel}
     */
    public createTable(npmModule: string, tableName: string, primaryKey: string): DatabaseTableModel {
        try {
            // if table exists, return it.
            return this.getTableOrFail(npmModule, tableName);
        } catch (e) {
            // this block is non-empty ;)
        }

        // creates a new table
        const table = new DatabaseTableModel(npmModule, tableName, primaryKey, new Date().valueOf());
        const updated = this.getTables().concat([table]);

        //console.log('Performing databaseTables INSERT in DB with: ', updated);
        this.tableModelStorage.set(updated);
        return table;
    }

    /**
     * This method inserts a new entry described by \a data in the table
     * pair of \a npmModule and \a tableName.
     *
     * An error is thrown when the value of the identifier, or primary key,
     * is missing or already exists.
     *
     * @param   {string}                    npmModule
     * @param   {string}                    tableName
     * @param   {DatabaseValueDictionary}   data
     * @returns {DatabaseTableEntryModel}
     * @throws  {Error}     On invalid pair of \a npmModule and \a tableName, not found in local cache.
     * @throws  {Error}     On missing primary key value (identifier).
     * @throws  {Error}     On already existing primary key value (identifier).
     */
    public insertEntry(npmModule: string, tableName: string, data: DatabaseValueDictionary): DatabaseTableEntryModel {
        let updated = [];

        // verifies existance of table
        const table = this.getTableOrFail(npmModule, tableName);

        // verifies presence of primary key value
        if (!(table.primaryKey in data)) {
            throw new Error(`Missing primary key value for insert in table: ${this.getTableName(npmModule, tableName)}.`);
        }

        // catches duplicate primary key value
        const id = data[table.primaryKey];
        if (!!this.findEntry(npmModule, tableName, id.toString())) {
            throw new Error(`Entry with primary key value of "${id}" already exists.`);
        }

        // create new database table entry
        let e = new DatabaseTableEntryModel(npmModule, tableName, data[table.primaryKey].toString(), data);
        e = Object.assign({}, e, data);

        // note: also holds entries from other tables
        updated = this.getEntries().concat([e]);
        //console.log('Performing databaseTableEntries INSERT in DB with: ', updated);

        this.entryModelStorage.set(updated);
        return e;
    }

    /**
     * This method updates an existing entry described by \a data in
     * the table with a pair of \a npmModule and \a tableName.
     *
     * The identifier of the entry being updated is read from \a data.
     *
     * An error is thrown when the value of the identifier, or primary
     * key, is missing or does not exist in the table.
     *
     * @param   {string}                    npmModule
     * @param   {string}                    tableName
     * @param   {DatabaseValueDictionary}   data
     * @returns {DatabaseService}
     * @throws  {Error}     On invalid pair of \a npmModule and \a tableName, not found in local cache.
     * @throws  {Error}     On missing primary key value (identifier).
     * @throws  {Error}     On invalid primary key value (identifier), not found in local cache.
     */
    public updateEntry(npmModule: string, tableName: string, data: DatabaseValueDictionary): DatabaseService {
        let updated = [];

        // verifies existance of table
        const table = this.getTableOrFail(npmModule, tableName);

        // verifies presence of primary key value
        if (!(table.primaryKey in data)) {
            throw new Error(`Missing primary key value for update in table: ${this.getTableName(npmModule, tableName)}.`);
        }

        // catches invalid primary key value (not found)
        const id = data[table.primaryKey];
        if (!this.findEntry(npmModule, tableName, id.toString())) {
            throw new Error(`Entry with primary key value of "${id}" does not exist.`);
        }

        // update one entry's "fields"
        updated = this.getEntries().map((e) => {
            if (e.identifier !== id) {
                return e;
            }

            e.values = Object.assign({}, e.values, data);
            return e;
        });

        //console.log('Performing databaseTableEntries UPDATE in DB with: ', updated);
        this.entryModelStorage.set(updated);
        return this;
    }

    /**
     * This method deletes an existing entry described by \a data in
     * the table with a pair of \a npmModule and \a tableName.
     *
     * The identifier of the entry being deleted is read from \a data.
     *
     * An error is thrown when the value of the identifier, or primary
     * key, is missing or does not exist in the table.
     *
     * @param   {string}                    npmModule
     * @param   {string}                    tableName
     * @param   {DatabaseValueDictionary}   data
     * @returns {DatabaseService}
     * @throws  {Error}     On invalid pair of \a npmModule and \a tableName, not found in local cache.
     * @throws  {Error}     On missing primary key value (identifier).
     * @throws  {Error}     On invalid primary key value (identifier), not found in local cache.
     */
    public deleteEntry(npmModule: string, tableName: string, data: DatabaseValueDictionary): DatabaseService {
        let updated = [];

        // verifies existance of table
        const table = this.getTableOrFail(npmModule, tableName);

        // verifies presence of primary key value
        if (!(table.primaryKey in data)) {
            throw new Error(`Missing primary key value for delete in table: ${this.getTableName(npmModule, tableName)}.`);
        }

        // catches invalid primary key value (not found)
        const id = data[table.primaryKey];
        if (!this.findEntry(npmModule, tableName, id.toString())) {
            throw new Error(`Entry with primary key value of "${id}" does not exist.`);
        }

        // filters out one entry based on primary key value
        updated = this.getEntries().filter((e) => e.npmModule !== npmModule || e.tableName !== tableName || e.identifier !== id);

        //console.log('Performing databaseTableEntries DELETE in DB with: ', updated);
        this.entryModelStorage.set(updated);
        return this;
    }
    /// end-region public API

    /// region protected API
    /**
     * This method throws an error if the table \a tableName
     * isn't registered for the module \a npmModule. In case
     * the table is registered, it will return the table.
     *
     * @param   {string}    npmModule
     * @param   {string}    tableName
     * @returns {DatabaseTableModel}
     * @throws  {Error}     On invalid pair of \a npmModule and \a tableName, not found in local cache.
     */
    protected getTableOrFail(npmModule: string, tableName: string): DatabaseTableModel {
        const table = this.findTable(npmModule, tableName);

        // check for presence
        if (!table) {
            throw new Error('Database table not found: ' + this.getTableName(npmModule, tableName));
        }

        return table;
    }

    /**
     * This method throws an error if the table \a tableName
     * isn't registered for the module \a npmModule.
     *
     * @param   {string}    npmModule
     * @param   {string}    tableName
     * @returns {DatabaseService}
     * @throws  {Error}     On invalid pair of \a npmModule and \a tableName, not found in local cache.
     */
    protected assertTableExists(npmModule: string, tableName: string): DatabaseService {
        const table = this.findTable(npmModule, tableName);

        // check for presence
        if (!table) {
            throw new Error('Database table not found: ' + this.getTableName(npmModule, tableName));
        }

        return this;
    }

    /**
     * This method throws an error if an entry of \a tableName
     * can't be fetched with the provided \a identifier.
     *
     * @param   {string}    npmModule
     * @param   {string}    tableName
     * @param   {string}    identifier
     * @returns {DatabaseService}
     * @throws  {Error}     On invalid triplet of \a npmModule, \a tableName and \a identifier, not found in local cache.
     */
    protected assertEntryExists(npmModule: string, tableName: string, identifier: string): DatabaseService {
        const entry = this.findEntry(npmModule, tableName, identifier);

        // check for presence
        if (!entry) {
            throw new Error(
                `Database table entry not found in ${this.getTableName(npmModule, tableName)} with primary key: ${identifier}.`,
            );
        }

        return this;
    }
    /// end-region protected API
}
