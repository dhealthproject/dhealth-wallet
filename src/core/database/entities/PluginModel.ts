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

// internal dependencies
import { AppRoute } from '@/router/AppRoute';

export interface PluginBadge {
    icon: string;
    label: string;
    color: string;
}

export class PluginModel {
    constructor(
        public readonly npmModule: string,
        public readonly installPath: string = '',
        public readonly name: string = '',
        public readonly version: string = '',
        public readonly main: string = '',
        public readonly view: string = '',
        public readonly author: PluginBridge.PackageAuthor = {},
        public readonly description: string = '',
        public readonly homepage: string = '',
        public readonly repository: PluginBridge.PackageRepository = {},
        public readonly dependencies: PluginBridge.PackageDependencies = {},
        public status: PluginBridge.PluginInstallStatus = PluginBridge.PluginInstallStatus.Installed,
        public readonly routes: AppRoute[] = [],
        public readonly components: string[] = [],
        public readonly storages: PluginBridge.PluginStorage[] = [],
        public readonly settings: PluginBridge.PluginSetting[] = [],
        public readonly permissions: PluginBridge.PluginPermission[] = [],
        public readonly imageUrl: string = 'https://yourdlt.tools/logo-yourdlt-192x192.png',
        public readonly badges: PluginBadge[] = [],
        public readonly createdAt: number = 0,
        public readonly updatedAt: number = 0,
    ) {}
}
