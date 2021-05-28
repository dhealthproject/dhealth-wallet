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

// internal dependencies
import { AppRoute } from '@/router/AppRoute';

export class PluginModel {
    constructor(
        public readonly npmModule: string,
        public readonly installPath: string,
        public readonly name: string,
        public readonly version: string,
        public readonly author: PluginBridge.PackageAuthor,
        public readonly description: string,
        public readonly homepage: string,
        public readonly repository: PluginBridge.PackageRepository,
        public readonly dependencies: PluginBridge.PackageDependencies,
        public readonly status: PluginBridge.PluginInstallStatus,
        public readonly routes: AppRoute[],
        public readonly components: PluginBridge.ComponentDictionary,
        public readonly storages: PluginBridge.PluginStorage[],
        public readonly settings: PluginBridge.PluginSetting[],
        public readonly permissions: PluginBridge.PluginPermission[],
        public readonly createdAt: number,
        public readonly updatedAt: number,
    ) {}
}
