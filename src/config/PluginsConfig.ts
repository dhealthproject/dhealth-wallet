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
        pluginFactory('@dhealth/plugin-node-manager', 'Node manager plugin for dHealth Network. Running a node? Monitor it here! Get alerts inside your Wallet when your node harvested a new block or interact with your node\'s delegated harvesters.', 'dHealth Network', true),
        pluginFactory('@dhealth/plugin-packntrack', 'Pack\'n\'Track is a smart packaging solution to attach tracking data to your packages. Adds trackable information to your packaging solutions, readable on the dHealth Network accounts information.', 'dHealth Network', true),
        pluginFactory('@dhealth/plugin-zksnarks', 'Create Zero-Knowledge Proofs using zkSNARKS (Succinct Non-Interactive Argument of Knowledge). This plugin illustrates the usage of Zero-Knowledge Proofs with dHealth Network in an innovative one-screener.', 'dHealth Network', true),
        pluginFactory('@ubcdigital/plugin-blogs', 'Blogs platform using dHealth Network. Write content and get rewarded by your audience. Do you write a lot? Get rewards by the word with this plugin where your audience can support you on the dHealth Network.', 'UBC Digital Magazine', false),
        pluginFactory('@ubcdigital/plugin-media', 'Media platform using dHealth Network. Buy and Sell media files using your DHP. Note that this plugin is not responsible for hosting media files. A marketplace is hereby enabled which acts as a registry for media files otherwise located.', 'UBC Digital Magazine', false),
        pluginFactory('@ubcdigital/plugin-social', 'Social content discovery using dHealth Network. Reward your friends on social networks with DHP. Invite friends by sending rewards that they can claim in up to one year. The best authors should be best rewarded!', 'UBC Digital Magazine', false),
        pluginFactory('@yourdlt/plugin-contractor', 'The plugin that lets you create and process smart contracts. Browse over to contractor.app for more details.', 'YourDLT by Using Blockchain Ltd', false),
        pluginFactory('@yourdlt/plugin-dummy', 'Example Plugin for dHealth Wallets. Fork this repository on Github to start developing your own.', 'YourDLT by Using Blockchain Ltd', false),
        pluginFactory('@yourdlt/plugin-librarian', 'Librarian lets you organize your on-chain data. This plugin applies natural language to a transactions list. Organize and locate your data with Tags for transactions, accounts, mosaics and namespaces.', 'YourDLT by Using Blockchain Ltd', false),
        pluginFactory('@yourdlt/plugin-ninjazzz', 'NinjaZZZ enlightens your lazy times. Find and catch the NinjaZZZ that show on idle time. You can then also claim ownership of caught NinjaZZZ by issuing a transaction right on the dHealth Network.', 'YourDLT by Using Blockchain Ltd', false),
        pluginFactory('@yourdlt/plugin-sam', '**SAM** - a Semi-Automated Market Maker, a.k.a. next-generation decentralized exchange smart contracts. This autonomous software package uses dHealth Network and multi-signature accounts to create smart digital markets.', 'YourDLT by Using Blockchain Ltd', false),
        pluginFactory('@yourdlt/plugin-taxical', 'Taxical is an international Tax calculator for dHealth Network. Use for informational purpose only. To facilitate the export and import of tax data related to your cryptocurrency holdings.', 'YourDLT by Using Blockchain Ltd', false),
    ],
};
const resolvedPluginsConfig: PluginsConfig = window['pluginsConfig'] || defaultPluginsConfig;
console.log('pluginsConfig resolved!', resolvedPluginsConfig);
export const pluginsConfig = resolvedPluginsConfig;
