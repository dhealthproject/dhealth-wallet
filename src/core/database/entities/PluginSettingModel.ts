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
 * @description This model describes plugin settings values that
 * can be set per profile. In case no value is set for a specific
 * profile, the `defaultValue` field of PluginSettingModel is used.
 */
export class PluginSettingModel {
    constructor(
        public readonly profileName: string,
        public readonly npmModule: string,
        public readonly optionName: string,
        public readonly optionValue: PluginBridge.ScalarValueType,
        public readonly createdAt: number,
        public readonly updatedAt: number,
    ) {}
}
