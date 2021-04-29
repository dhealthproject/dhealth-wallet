import {
    AccountInfo,
    AccountNames,
    ChainInfo,
    ChainProperties,
    Currency,
    FinalizedBlock,
    MosaicId,
    MultisigAccountGraphInfo,
    NamespaceId,
    NamespaceName,
    NetworkConfiguration,
    NetworkCurrencies,
    NetworkProperties,
    NetworkType,
    NodeInfo,
    PluginProperties,
    RentalFees,
    StorageInfo,
    TransactionFees,
    UInt64,
} from 'symbol-sdk';
import { NodeIdentityEqualityStrategy } from 'symbol-openapi-typescript-fetch-client';
import { Address } from 'symbol-sdk';
import { AccountType } from 'symbol-sdk';
import { SupplementalPublicKeys } from 'symbol-sdk';
import { networkConfig } from '@/config';

export const OfflineUrl = 'http://mock:3000';

export const OfflineGenerationHash = {
    [NetworkType.TEST_NET]: networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.generationHash,
    [NetworkType.MAIN_NET]: networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.generationHash,
};

export const OfflineTransactionFees = new TransactionFees(84587, 100, 1136363, 0, 0);

export const OfflineNodeInfo = (networkType: NetworkType) =>
    new NodeInfo('pubkey', OfflineGenerationHash[networkType], 3000, networkType, 0, [], 'host', 'name');

export const OfflineNetworkProperties = {
    [NetworkType.TEST_NET]: new NetworkConfiguration(
        new NetworkProperties(
            'public-test',
            NodeIdentityEqualityStrategy.Host,
            'B4EDD106057B631DAA45BDEF97D5E8E43C4C426B1C024086202200D72EDA988E',
            OfflineGenerationHash[NetworkType.TEST_NET],
            networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.epochAdjustment + 's',
        ),
        new ChainProperties(
            true,
            true,
            networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.currencyMosaicId,
            networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.harvestingMosaicId,
            networkConfig[NetworkType.TEST_NET].networkConfigurationDefaults.blockGenerationTargetTime + 's',
            "3'000",
            '180',
            '180',
            '5',
            '0',
            '60',
            '100',
            '6h',
            '500ms',
            "1'000'000'000'000'000",
            "9'000'000'000'000'000",
            "1'000'000'000'000'000",
            "2'000'000'000",
            "200'000'000'000'000",
            "2'000'000'000'000",
            '3',
            '28',
            '720',
            '10',
            '5',
            'TCOMFIBVPWGB5O5CQXHEINKYQDXNIMGBCUHNJBQ',
            undefined,
            "6'000",
        ),
        new PluginProperties(),
    ),
    [NetworkType.MAIN_NET]: new NetworkConfiguration(
        new NetworkProperties(
            'public',
            NodeIdentityEqualityStrategy.Host,
            '907B74B4EAA4F8DA48162B624C933FD1F3F51714A6EE8A78BB1713F5D6959E0A',
            OfflineGenerationHash[NetworkType.MAIN_NET],
            networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.epochAdjustment + 's',
        ),
        new ChainProperties(
            true,
            true,
            networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.currencyMosaicId,
            networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.harvestingMosaicId,
            networkConfig[NetworkType.MAIN_NET].networkConfigurationDefaults.blockGenerationTargetTime + 's',
            "3'000",
            '180',
            '720',
            '5',
            '0',
            '60',
            '100',
            '6h',
            '500ms',
            "1'000'000'000'000'000",
            "9'000'000'000'000'000",
            "1'000'000'000'000'000",
            "2'000'000'000",
            "200'000'000'000'000",
            "2'000'000'000'000",
            '3',
            '112',
            '360',
            '10',
            '5',
            'NCOMSWYJ5E6WRQV7GBLHCIITDAVDZQ5HEMYJV6I',
            undefined,
            "6'000",
        ),
        new PluginProperties(),
    ),
};

export const OfflineChainInfo = new ChainInfo(
    UInt64.fromUint(1),
    UInt64.fromUint(1),
    UInt64.fromUint(1),
    // mainnet nemesis block hash for dHealth
    new FinalizedBlock(UInt64.fromUint(1), '01FBFF8ACBD0EFA47E9874882EECBC327E2B2E7076577F5A1A31FE5A358EC070', 1, 1),
);

export const OfflineAccountInfo = (address: Address) =>
    new AccountInfo(
        0,
        'recordId',
        address,
        UInt64.fromUint(0),
        '0000000000000000000000000000000000000000000000000000000000000000',
        UInt64.fromUint(0),
        AccountType.Unlinked,
        new SupplementalPublicKeys(),
        [],
        [],
        UInt64.fromUint(0),
        UInt64.fromUint(0),
    );

export const OfflineStorageInfo = new StorageInfo(0, 0, 0);

export const OfflineRentalFees = new RentalFees(UInt64.fromUint(1000), UInt64.fromUint(100000), UInt64.fromUint(500000));

export const OfflineAccountNames = (address: Address) => new AccountNames(address, []);

export const OfflineNamespaceNames = (namespaceId: NamespaceId) => new NamespaceName(namespaceId, 'mocknamespace');

export const OfflineMultisigAccountGraphInfo = new MultisigAccountGraphInfo(new Map());

export const OfflineNetworkCurrencies = (networkType: NetworkType): NetworkCurrencies => {
    const publicCurrency = new Currency({
        namespaceId: new NamespaceId('dhealth.dhp'),
        divisibility: 6,
        transferable: true,
        supplyMutable: false,
        restrictable: false,
        mosaicId: new MosaicId(networkConfig[networkType].networkConfigurationDefaults.currencyMosaicId),
    });
    return new NetworkCurrencies(publicCurrency, publicCurrency);
};
