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

export interface NodeConfig {
    roles: number;
    friendlyName: string;
    url: string;
}

export interface NetworkConfigurationDefaults {
    maxTransactionsPerAggregate: number;
    maxMosaicDuration: number;
    lockedFundsPerAggregate: string;
    maxNamespaceDuration: number;
    maxCosignatoriesPerAccount: number;
    maxMosaicAtomicUnits: number;
    blockGenerationTargetTime: number;
    currencyMosaicId: string;
    namespaceGracePeriodDuration: number;
    harvestingMosaicId: string;
    minNamespaceDuration: number;
    maxCosignedAccountsPerAccount: number;
    maxNamespaceDepth: number;
    defaultDynamicFeeMultiplier: number;
    maxMosaicDivisibility: number;
    maxMessageSize: number;
    epochAdjustment: number;
    totalChainImportance: number;
    generationHash: string;
}

export interface NetworkConfig {
    networkName: string;
    faucetUrl: string;
    nodes: NodeConfig[];
    defaultNetworkType: number;
    explorerUrl: string;
    networkConfigurationDefaults: NetworkConfigurationDefaults;
}

export const defaultTestnetNetworkConfig: NetworkConfig = {
    networkName: 'dHealth Test Network',
    explorerUrl: 'https://explorer.dhealth.dev/',
    faucetUrl: 'https://faucet.dhealth.dev/',
    defaultNetworkType: 152,
    networkConfigurationDefaults: {
        maxMosaicDivisibility: 6,
        namespaceGracePeriodDuration: 1051200, // 365d
        lockedFundsPerAggregate: '10000000',
        maxCosignatoriesPerAccount: 25,
        blockGenerationTargetTime: 30,
        maxNamespaceDepth: 3,
        maxMosaicDuration: 10512000, // 3650d
        minNamespaceDuration: 10512000, // 3650d
        maxNamespaceDuration: 10512000, // 3650d
        maxTransactionsPerAggregate: 100,
        maxCosignedAccountsPerAccount: 25,
        maxMessageSize: 1024,
        maxMosaicAtomicUnits: 9000000000000000,
        currencyMosaicId: '5A4935C1D66E6AC4',
        harvestingMosaicId: '5A4935C1D66E6AC4',
        defaultDynamicFeeMultiplier: 100,
        epochAdjustment: 1616978397,
        totalChainImportance: 1000000000000000,
        generationHash: 'F1DE7701FF17DA20904565FA9753690A9990D3B00730A241FFFB7F60C2B5D638',
    },
    nodes: [
        { friendlyName: 'dhealth-dual-01', roles: 7, url: 'https://dual-01.dhealth.dev:3001' },
        { friendlyName: 'dhealth-dual-02', roles: 7, url: 'https://dual-02.dhealth.dev:3001' },
        { friendlyName: 'dhealth-api-01', roles: 2, url: 'https://api-01.dhealth.dev:3001' },
        { friendlyName: 'dhealth-api-02', roles: 2, url: 'https://api-02.dhealth.dev:3001' },
    ],
};

export const defaultMainnetNetworkConfig: NetworkConfig = {
    networkName: 'dHealth Public Network',
    explorerUrl: 'http://explorer.dhealth.cloud/',
    faucetUrl: 'http://faucet.dhealth.cloud/',
    defaultNetworkType: 104,
    networkConfigurationDefaults: {
        maxMosaicDivisibility: 6,
        namespaceGracePeriodDuration: 1051200, // 365d
        lockedFundsPerAggregate: '10000000',
        maxCosignatoriesPerAccount: 25,
        blockGenerationTargetTime: 30,
        maxNamespaceDepth: 3,
        maxMosaicDuration: 10512000, // 3650d
        minNamespaceDuration: 10512000, // 3650d
        maxNamespaceDuration: 10512000, // 3650d
        maxTransactionsPerAggregate: 100,
        maxCosignedAccountsPerAccount: 25,
        maxMessageSize: 1024,
        maxMosaicAtomicUnits: 9000000000000000,
        currencyMosaicId: '39E0C49FA322A459',
        harvestingMosaicId: '39E0C49FA322A459',
        defaultDynamicFeeMultiplier: 100,
        epochAdjustment: 1616978397,
        totalChainImportance: 1000000000000000,
        generationHash: 'ED5761EA890A096C50D3F50B7C2F0CCB4B84AFC9EA870F381E84DDE36D04EF16',
    },
    nodes: [
        { friendlyName: 'dhealth-dual-01', roles: 7, url: 'http://dual-01.dhealth.cloud:3000' },
        { friendlyName: 'dhealth-dual-02', roles: 7, url: 'http://dual-02.dhealth.cloud:3000' },
        { friendlyName: 'dhealth-dual-03', roles: 7, url: 'http://dual-03.dhealth.cloud:3000' },
        { friendlyName: 'dhealth-api-01', roles: 2, url: 'http://api-01.dhealth.cloud:3000' },
        { friendlyName: 'dhealth-api-02', roles: 2, url: 'http://api-02.dhealth.cloud:3000' },
    ],
};

const defaultNetworkConfig: Record<number, NetworkConfig> = {
    152: defaultTestnetNetworkConfig,
    104: defaultMainnetNetworkConfig,
};

const resolvedNetworkConfig: NetworkConfig = window['networkConfig'] || defaultNetworkConfig;
console.log('networkConfig resolved!', resolvedNetworkConfig);
export const networkConfig = resolvedNetworkConfig;
