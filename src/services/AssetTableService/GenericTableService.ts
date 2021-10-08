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
// internal dependencies
import { AssetTableService, TableField } from './AssetTableService';

/**
 * Table actions
 * @export
 * @type {TableAction}
 */
export type TableAction = {
    id: string;
    label: string;
    icon: string;
};

export class GenericTableService extends AssetTableService {
    constructor(currentHeight: number, private readonly rows: any[], private readonly fields: TableField[]) {
        super(currentHeight);
    }

    /**
     * Return table fields to be displayed in a table header
     * @returns {TableField[]}
     */
    public getTableFields(): TableField[] {
        return this.fields;
    }

    /**
     * Return table values to be displayed in a table rows
     */
    public getTableRows(): any[] {
        // - get reactive rows data from the store
        return this.rows.map((currentRow) => ({ ...currentRow })).filter((x) => x); // filter out rows that are not yet available
    }
}
