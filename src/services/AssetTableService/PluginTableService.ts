/*
 * Copyright 2020 NEM (https://nem.io)
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
import { PluginModel } from '@/core/database/entities/PluginModel';

export class PluginTableService extends AssetTableService {
    constructor(currentHeight: number, private readonly plugins: PluginModel[]) {
        super(currentHeight);
    }

    /**
     * Return table fields to be displayed in a table header
     * @returns {TableField[]}
     */
    public getTableFields(): TableField[] {
        return [
            { name: 'npmModule', label: 'table_header_npm_module' },
            { name: 'name', label: 'table_header_name' },
            { name: 'author', label: 'table_header_author' },
            { name: 'description', label: 'table_header_description' },
            { name: 'repository', label: 'table_header_repository' },
        ];
    }

    /**
     * Return table values to be displayed in a table rows
     */
    public getTableRows(): any[] {
        // - get reactive plugins data from the store
        return this.plugins
            .map((pluginInfo) => {
                // - map table fields
                return {
                    npmModule: pluginInfo.npmModule + '@v' + pluginInfo.version,
                    name: pluginInfo.name || pluginInfo.npmModule,
                    author: pluginInfo.author.name,
                    description: pluginInfo.description,
                    repository: pluginInfo.repository.url,
                };
            })
            .filter((x) => x); // filter out plugins that are not yet available
    }
}
