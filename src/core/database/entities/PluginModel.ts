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
import Vue, { ComponentOptions, AsyncComponent } from 'vue';
import { AppRoute } from '@/router/AppRoute'
import { VersionedObjectStorage } from '@/core/database/backends/VersionedObjectStorage';
import { SettingsModel } from '@/core/database/entities/SettingsModel';

export enum PluginInstallStatus {
    Installed = 'installed',
    Enabled = 'enabled',
    Disabled = 'disabled',
    Uninstalled = 'uninstalled',
}

export type PluginAuthor = {
    name: string;
    email?: string;
    url?: string;
};

export type PluginRepository = {
    type: string;
    url: string;
};

export type PluginDependencies = {
    [npmModule: string]: string;
};

export type PluginClassMap = {
    [identifier: string]: string
}

type Component = ComponentOptions<Vue> | typeof Vue | AsyncComponent;
type Dictionary<T> = { [key: string]: T };

export class PluginModel {
    constructor(
        public readonly npmModule: string,
        public readonly installPath: string,
        public readonly name: string,
        public readonly version: string,
        public readonly author: PluginAuthor,
        public readonly description: string,
        public readonly homepage: string,
        public readonly repository: PluginRepository,
        public readonly dependencies: PluginDependencies,
        public readonly status: PluginInstallStatus,
        public readonly routes: AppRoute[],
        public readonly components: Dictionary<Component>,
        public readonly storages: VersionedObjectStorage<any>[],
        public readonly settings: SettingsModel[],
        public readonly createdAt: number,
        public readonly updatedAt: number,
    ) {}
}
