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
import { PluginBridge } from '@dhealth/wallet-api-bridge';

/**
 * @description Permissions describe in-app entities or items that can be
 * accessed by specific plugins. A plugin *always* requests permission to
 * the active user when it gets enabled. This model describes the item to
 * be shared and is linked to a specific plugin NPM module.
 */
export class PermissionModel {
    constructor(
        public readonly profileName: string,
        public readonly npmModule: string,
        public readonly permission: PluginBridge.PluginPermission,
        public readonly createdAt: number,
        public readonly deletedAt?: number | undefined,
    ) {}
}
