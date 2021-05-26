/*
 * Copyright 2020 NEM (https://nem.io)
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

import { NetworkType, NodeInfo, TransactionFees } from 'symbol-sdk';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { networkConfig } from '@/config';

/**
 * Stored POJO that holds network information.
 *
 * The stored data is cached from rest.
 *
 * The object is serialized and deserialized to/from JSON. no method or complex attributes can be fined.
 *
 */
export class NetworkModel {
    public readonly networkName: string;

    constructor(
        public readonly url: string,
        public readonly networkType: NetworkType,
        public readonly generationHash: string,
        public readonly networkConfiguration: NetworkConfigurationModel,
        public readonly transactionFees: TransactionFees,
        public readonly nodeInfo: NodeInfo,
    ) {
        this.networkName = NetworkModel.getNetworkName(this.generationHash);
    }

    /**
     * This method identifies a network by generation hash
     * and returns its network name or defaults to testnet.
     *
     * @param   {string}    genHash
     * @returns {string}
     */
    public static getNetworkName(genHash: string): string {
        // find network by generation hash
        const identifier = Object.keys(networkConfig).filter(
            (n) => networkConfig[n].networkConfigurationDefaults.generationHash === genHash,
        );

        // default to testnet
        if (!identifier.length) {
            return networkConfig[NetworkType.TEST_NET].networkName;
        }

        return networkConfig[identifier.shift()].networkName;
    }
}
