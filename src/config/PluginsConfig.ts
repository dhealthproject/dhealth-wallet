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
import { PluginModel, PluginBadge } from '@/core/database/entities/PluginModel';

export interface PluginsConfig {
    registryPlugins: PluginModel[];
}

const badgeFactory = (icon, label, color) => {
    return { icon, label, color } as PluginBadge;
};

const pluginFactory = (
    npmModule,
    friendlyName,
    description,
    authorName = 'YourDLT by Using Blockchain Ltd',
    isOfficial = false,
    homepage = 'https://github.com/dhealthproject',
) => {
    return new PluginModel(
        npmModule,
        undefined, // installPath
        npmModule,
        friendlyName,
        'latest',
        undefined, // main
        undefined, // view
        { name: authorName },
        description,
        homepage, // homepage
        undefined, // repository
        undefined, // dependencies
        undefined, // status
        undefined, // routes
        undefined, // components
        undefined, // storages
        undefined, // settings
        undefined, // permissions
        'https://yourdlt.tools/logo-yourdlt-192x192.png',
        isOfficial
            ? [badgeFactory('ios-checkbox-outline', 'Official', '#33dd50'), badgeFactory('ios-star-outline', 'Recommended', '#33dd50')]
            : [badgeFactory('md-people', 'Community', '#00c8ff')],
    );
};

const defaultPluginsConfig: PluginsConfig = {
    registryPlugins: [
        pluginFactory(
            '@dhealth/plugin-node-monitor',
            'Node Monitor',
            'Node Monitor helps monitor your dHealth Network Nodes.',
            'dHealth Network',
            true,
        ),
        pluginFactory(
            '@dhealthdapps/health-to-earn',
            'Health to Earn',
            'dHealth Network - Health to Earn showcase with Strava.',
            'dHealth Network',
            true,
        ),
        pluginFactory(
            '@dhealthdapps/bridge',
            'dHealth Bridge',
            'Unidirectional Bridge for ERC20-DHP (Ethereum) to native DHP (dHealth)',
            'dHealth Network',
            true,
        ),
        pluginFactory(
            '@yourdlt/plugin-dummy',
            'Dummy',
            'Example Plugin for YourDLT / dHealth / Symbol Wallets.',
            'YourDLT by Using Blockchain Ltd',
            false,
        ),
        pluginFactory(
            '@yourdlt/plugin-librarian',
            'Librarian',
            'Librarian helps organize your on-chain data with YourDLT.',
            'YourDLT by Using Blockchain Ltd',
            false,
        ),
        pluginFactory(
            '@yourdlt/plugin-ninjazzz',
            'NinjaZZZ',
            'NinjaZZZ enlightens your lazy times. Hint: **Idle time**.',
            'YourDLT by Using Blockchain Ltd',
            false,
        ),
    ],
};
const resolvedPluginsConfig: PluginsConfig = window['pluginsConfig'] || defaultPluginsConfig;
console.log('pluginsConfig resolved!', resolvedPluginsConfig);
export const pluginsConfig = resolvedPluginsConfig;
