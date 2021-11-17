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

const pluginFactory = (npmModule, description, authorName = 'YourDLT by Using Blockchain Ltd', isOfficial = false) => {
    return new PluginModel(
        npmModule,
        undefined, // installPath
        npmModule,
        'latest',
        undefined, // main
        undefined, // view
        { name: authorName },
        description,
        undefined, // homepage
        undefined, // repository
        undefined, // dependencies
        undefined, // status
        undefined, // routes
        undefined, // components
        undefined, // storages
        undefined, // settings
        undefined, // permissions
        'https://yourdlt.tools/logo-yourdlt-192x192.png',
        isOfficial ? [
            badgeFactory('ios-checkbox-outline', 'Official', '#33dd50'),
            badgeFactory('ios-star-outline', 'Recommended', '#33dd50')
        ] : [
            badgeFactory('md-people', 'Community', '#00c8ff')
        ]
    );
}

const badgeFactory = (icon, label, color) => {
    return { icon, label, color } as PluginBadge;
}

const defaultPluginsConfig: PluginsConfig = {
    registryPlugins: [
        pluginFactory('@dhealth/plugin-node-monitor', 'Node manager plugin for dHealth Network. Running a node? Monitor it here! Get alerts inside your Wallet when your node harvested a new block or interact with your node\'s delegated harvesters.', 'dHealth Network', true),
        pluginFactory('@dhealthdapps/health-to-earn', 'Health to Earn with Strava is a showcase to earn dhealth.dhp with your Strava account.', 'dHealth Network', true),
        pluginFactory('@yourdlt/plugin-dummy', 'Example Plugin for dHealth Wallets. Fork this repository on Github to start developing your own.', 'YourDLT by Using Blockchain Ltd', false),
        pluginFactory('@yourdlt/plugin-librarian', 'Librarian lets you organize your on-chain data. This plugin applies natural language to a transactions list. Organize and locate your data with Tags for transactions, accounts, mosaics and namespaces.', 'YourDLT by Using Blockchain Ltd', false),
        pluginFactory('@yourdlt/plugin-ninjazzz', 'NinjaZZZ enlightens your lazy times. Find and catch the NinjaZZZ that show on idle time. You can then also claim ownership of caught NinjaZZZ by issuing a transaction right on the dHealth Network.', 'YourDLT by Using Blockchain Ltd', false),
    ],
};
const resolvedPluginsConfig: PluginsConfig = window['pluginsConfig'] || defaultPluginsConfig;
console.log('pluginsConfig resolved!', resolvedPluginsConfig);
export const pluginsConfig = resolvedPluginsConfig;
