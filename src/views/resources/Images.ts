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
import { TransactionType } from 'symbol-sdk';

// @ts-ignore
import createImg from '@/views/resources/img/icons/Read.svg';
// @ts-ignore
import seedImg from '@/views/resources/img/icons/Incoming.svg';
// @ts-ignore
import importStepImage1 from '@/views/resources/img/login/1_4.png';
// @ts-ignore
import importStepImage2 from '@/views/resources/img/login/2_4.png';
// @ts-ignore
import importStepImage3 from '@/views/resources/img/login/3_4.png';
// @ts-ignore
import importStepImage4 from '@/views/resources/img/login/4_4.png';
// @ts-ignore
import createStepImage1 from '@/views/resources/img/login/1_5.png';
// @ts-ignore
import createStepImage2 from '@/views/resources/img/login/2_5.png';
// @ts-ignore
import createStepImage3 from '@/views/resources/img/login/3_5.png';
// @ts-ignore
import createStepImage4 from '@/views/resources/img/login/4_5.png';
// @ts-ignore
import createStepImage5 from '@/views/resources/img/login/5_5.png';
// @ts-ignore
import dashboardUnconfirmed from '@/views/resources/img/monitor/dash-board/dashboardUnconfirmed.png';
// @ts-ignore
import selected from '@/views/resources/img/monitor/mosaics/selected.png';
// @ts-ignore
import unselected from '@/views/resources/img/monitor/mosaics/unselected.png';

// official icons

// @ts-ignore
import accountRestrictionAlt from '@/views/resources/img/icons/account-restriction-alt.png';
// @ts-ignore
import accountRestriction from '@/views/resources/img/icons/account-restriction.png';
// @ts-ignore
import aggregate from '@/views/resources/img/icons/aggregate.svg';
// @ts-ignore
import aggregateTransaction from '@/views/resources/img/icons/aggregate-transaction.png';
// @ts-ignore
import alias from '@/views/resources/img/icons/alias.png';
// @ts-ignore
import customerAlice from '@/views/resources/img/icons/customer-alice.png';
// @ts-ignore
import dashboard from '@/views/resources/img/icons/dashboard.png';
// @ts-ignore
import enterprise from '@/views/resources/img/icons/enterprise.png';
// @ts-ignore
import explorer from '@/views/resources/img/newicons/NavExplorer.svg';
// @ts-ignore
import harvest from '@/views/resources/img/icons/harvest.svg';
// @ts-ignore
import history from '@/views/resources/img/icons/history.png';
// @ts-ignore
import incoming from '@/views/resources/img/icons/incoming.png';
// @ts-ignore
import lock from '@/views/resources/img/icons/lock.png';
// @ts-ignore
import metadata from '@/views/resources/img/icons/metadata.png';
// @ts-ignore
import mosaic from '@/views/resources/img/icons/mosaic.svg';
// @ts-ignore
import mosaicTransaction from '@/views/resources/img/icons/mosaic.png';
// @ts-ignore
import mosaicRestriction from '@/views/resources/img/icons/mosaic-restriction.png';
// @ts-ignore
import multipleParties from '@/views/resources/img/icons/multiple-parties.png';
// @ts-ignore
import multisig from '@/views/resources/img/icons/multisig.svg';
// @ts-ignore
import namespace from '@/views/resources/img/icons/namespace.svg';
// @ts-ignore
import namespaceTransaction from '@/views/resources/img/icons/namespace.png';
// @ts-ignore
import news from '@/views/resources/img/icons/news.svg';
// @ts-ignore
import outgoing from '@/views/resources/img/icons/outgoing.png';
// @ts-ignore
import pending from '@/views/resources/img/icons/pending.png';
// @ts-ignore
import publicChain from '@/views/resources/img/icons/public-chain.png';
// @ts-ignore
import publicKey from '@/views/resources/img/icons/public-key.png';
// @ts-ignore
import receive2 from '@/views/resources/img/icons/receive2.png';
// @ts-ignore
import send2 from '@/views/resources/img/icons/send2.png';
// @ts-ignore
import sent from '@/views/resources/img/icons/sent.png';
// @ts-ignore
import settings from '@/views/resources/img/newicons/NavSettings.svg';
// @ts-ignore
import wallet from '@/views/resources/img/icons/wallet.svg';
// @ts-ignore
import voting from '@/views/resources/img/navbar/explorer.svg';
// @ts-ignore
import faucet from '@/views/resources/img/navbar/faucet.svg';
// @ts-ignore
import settings from '@/views/resources/img/navbar/settings.svg';
// @ts-ignore
import warning from '@/views/resources/img/icons/warning.png';
// @ts-ignore
import warningWhite from '@/views/resources/img/icons/warning-white.png';
// @ts-ignore
import infoWhite from '@/views/resources/img/icons/info-white.png';

/// region exported image objects
export const walletTypeImages = {
    createImg,
    seedImg,
};

export const importStepImage = {
    importStepImage1,
    importStepImage2,
    importStepImage3,
    importStepImage4,
};

export const createStepImage = {
    createStepImage1,
    createStepImage2,
    createStepImage3,
    createStepImage4,
    createStepImage5,
};

export const dashboardImages = {
    dashboardUnconfirmed,
    selected,
    unselected,
};

// icons provided by the marketing agency
export const officialIcons = {
    accountRestrictionAlt,
    accountRestriction,
    aggregate,
    aggregateTransaction,
    alias,
    customerAlice,
    dashboard,
    enterprise,
    explorer,
    harvest,
    history,
    incoming,
    lock,
    metadata,
    mosaic,
    mosaicRestriction,
    mosaicTransaction,
    multipleParties,
    multisig,
    namespace,
    namespaceTransaction,
    news,
    outgoing,
    pending,
    publicChain,
    publicKey,
    receive2,
    send2,
    sent,
    settings,
    wallet,
    voting,
    faucet,
    warning,
    warningWhite,
    infoWhite,
};

export const transactionTypeToIcon = {
    [TransactionType.NAMESPACE_REGISTRATION]: officialIcons.namespaceTransaction,
    [TransactionType.ADDRESS_ALIAS]: officialIcons.alias,
    [TransactionType.MOSAIC_ALIAS]: officialIcons.namespaceTransaction,
    [TransactionType.MOSAIC_DEFINITION]: officialIcons.mosaicTransaction,
    [TransactionType.MOSAIC_SUPPLY_CHANGE]: officialIcons.mosaicTransaction,
    [TransactionType.MULTISIG_ACCOUNT_MODIFICATION]: officialIcons.multipleParties,
    [TransactionType.AGGREGATE_COMPLETE]: officialIcons.aggregateTransaction,
    [TransactionType.AGGREGATE_BONDED]: officialIcons.aggregateTransaction,
    [TransactionType.HASH_LOCK]: officialIcons.lock,
    [TransactionType.SECRET_LOCK]: officialIcons.lock,
    [TransactionType.SECRET_PROOF]: officialIcons.lock,
    [TransactionType.ACCOUNT_ADDRESS_RESTRICTION]: officialIcons.accountRestriction,
    [TransactionType.ACCOUNT_MOSAIC_RESTRICTION]: officialIcons.mosaicRestriction,
    [TransactionType.ACCOUNT_OPERATION_RESTRICTION]: officialIcons.accountRestrictionAlt,
    [TransactionType.ACCOUNT_KEY_LINK]: officialIcons.publicKey,
    [TransactionType.MOSAIC_ADDRESS_RESTRICTION]: officialIcons.mosaicRestriction,
    [TransactionType.MOSAIC_GLOBAL_RESTRICTION]: officialIcons.mosaicRestriction,
    [TransactionType.ACCOUNT_METADATA]: officialIcons.metadata,
    [TransactionType.MOSAIC_METADATA]: officialIcons.metadata,
    [TransactionType.NAMESPACE_METADATA]: officialIcons.metadata,
    [TransactionType.VOTING_KEY_LINK]: officialIcons.publicKey,
    [TransactionType.VRF_KEY_LINK]: officialIcons.publicKey,
    [TransactionType.NODE_KEY_LINK]: officialIcons.publicKey,
};

/// end-region exported image objects
