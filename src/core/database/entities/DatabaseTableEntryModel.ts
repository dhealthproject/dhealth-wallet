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
import { PluginBridge } from '@yourdlt/wallet-api-bridge';

/**
 * @internal This type describes a value dictionary with keys
 * as {string} and values as _scalar_ values or array of scalar values.
 */
type ValueDictionary = {
    [key: string]: PluginBridge.ScalarValueType;
};

export class DatabaseTableEntryModel {
    constructor(
        public readonly npmModule: string,
        public readonly tableName: string,
        public readonly identifier: string,
        public values: ValueDictionary,
        public readonly createdAt: number = 0,
        public readonly updatedAt: number = 0,
    ) {}
}
