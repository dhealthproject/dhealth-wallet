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
import {
    UInt64,
    AccountKeyLinkTransaction,
    LinkAction,
    Transaction,
    VrfKeyLinkTransaction,
    Account,
    NodeKeyLinkTransaction,
    PersistentDelegationRequestTransaction,
    AccountInfo,
    AggregateTransaction,
    PublicAccount,
    Deadline,
    LockFundsTransaction,
    Mosaic,
    SignedTransaction,
    Password,
    Crypto,
    TransactionType,
} from 'symbol-sdk';
import { Component, Prop, Watch } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import Vue from 'vue';

// internal dependencies
import { Formatters } from '@/core/utils/Formatters';
import { FormTransactionBase } from '@/views/forms/FormTransactionBase/FormTransactionBase';

// child components
import { ValidationObserver } from 'vee-validate';
// @ts-ignore
import FormWrapper from '@/components/FormWrapper/FormWrapper.vue';
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';
// @ts-ignore
import SignerSelector from '@/components/SignerSelector/SignerSelector.vue';
// @ts-ignore
import MaxFeeAndSubmit from '@/components/MaxFeeAndSubmit/MaxFeeAndSubmit.vue';
// @ts-ignore
import NetworkNodeSelector from '@/components/NetworkNodeSelector/NetworkNodeSelector.vue';
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import ErrorTooltip from '@/components/ErrorTooltip/ErrorTooltip.vue';
// @ts-ignore
import Alert from '@/components/Alert/Alert.vue';
import { ValidationProvider } from 'vee-validate';
import { NavigationLinks } from '@dhealth/wallet-components';

import { HarvestingStatus } from '@/store/Harvesting';
import { AccountTransactionSigner, TransactionAnnouncerService, TransactionSigner } from '@/services/TransactionAnnouncerService';
import { Observable, of } from 'rxjs';
import { flatMap, map, tap } from 'rxjs/operators';
import { BroadcastResult } from '@/core/transactions/BroadcastResult';
import { NodeModel } from '@/core/database/entities/NodeModel';
import { MosaicModel } from '@/core/database/entities/MosaicModel';
import { HarvestingModel } from '@/core/database/entities/HarvestingModel';
import { AccountModel, AccountType } from '@/core/database/entities/AccountModel';

import { appConfig } from '@/config';
const { MIN_HARVESTER_BALANCE } = appConfig.constants;

//@ts-ignore
import ButtonCopyToClipboard from '@/components/ButtonCopyToClipboard/ButtonCopyToClipboard.vue';
// @ts-ignore
import AccountPublicKeyDisplay from '@/components/AccountPublicKeyDisplay/AccountPublicKeyDisplay.vue';
// @ts-ignore
import ProtectedPrivateKeyDisplay from '@/components/ProtectedPrivateKeyDisplay/ProtectedPrivateKeyDisplay.vue';
// @ts-ignore
import ModalFormProfileUnlock from '@/views/modals/ModalFormProfileUnlock/ModalFormProfileUnlock.vue';
import { officialIcons } from '@/views/resources/Images';
// @ts-ignore
import ModalImportPrivateKey from '@/views/modals/ModalImportPrivateKey/ModalImportPrivateKey.vue';
// @ts-ignore
import ModalConfirm from '@/views/modals/ModalConfirm/ModalConfirm.vue';
// @ts-ignore
import MaxFeeSelector from '@/components/MaxFeeSelector/MaxFeeSelector.vue';

export enum HarvestingAction {
    START = 1,
    STOP = 2,
    SWAP = 3,
    ACTIVATE = 4,
    SINGLE_KEY = 5,
}
export enum PublicKeyTitle {
    REMOTE = 'create_remote_public_key',
    VRF = 'create_vrf_public_key',
}

@Component({
    components: {
        Alert,
        FormWrapper,
        ModalTransactionConfirmation,
        SignerSelector,
        ValidationObserver,
        MaxFeeAndSubmit,
        FormRow,
        NetworkNodeSelector,
        ErrorTooltip,
        ValidationProvider,
        ButtonCopyToClipboard,
        AccountPublicKeyDisplay,
        ProtectedPrivateKeyDisplay,
        ModalFormProfileUnlock,
        ModalImportPrivateKey,
        NavigationLinks,
        ModalConfirm,
        MaxFeeSelector,
    },
    computed: {
        ...mapGetters({
            currentHeight: 'network/currentHeight',
            currentSignerAccountInfo: 'account/currentSignerAccountInfo',
            harvestingStatus: 'harvesting/status',
            currentSignerHarvestingModel: 'harvesting/currentSignerHarvestingModel',
            networkBalanceMosaics: 'mosaic/networkBalanceMosaics',
            currentAccount: 'account/currentAccount',
            feesConfig: 'network/feesConfig',
            accountsInfo: 'account/accountsInfo',
        }),
    },
})
export class FormPersistentDelegationRequestTransactionTs extends FormTransactionBase {
    @Prop({ default: null }) signerAddress: string;
    //@Prop({ default: true }) withLink: boolean;

    /**
     * Formatters helpers
     */
    public formatters = Formatters;

    /**
     * Form items
     */
    public formItems = {
        nodeModel: { nodePublicKey: '' } as NodeModel,
        signerAddress: '',
        maxFee: 1,
    };
    private accountsInfo: AccountInfo[];

    private newVrfKeyAccount: Account;
    private newRemoteAccount: Account;

    public currentAccount: AccountModel;
    /**
     * Current signer account info
     */
    private currentSignerAccountInfo: AccountInfo;

    private currentSignerHarvestingModel: HarvestingModel;

    private action = HarvestingAction.START;

    private harvestingStatus: HarvestingStatus;

    private tempTransactionSigner: TransactionSigner;
    private tempAccount: Account;
    public vrfPrivateKeyTemp: string;
    public remotePrivateKeyTemp: string;

    /**
     * Panel tab management getters/setters
     */
    public showConfirmModal = false;
    public isDelegatedHarvestingWarningModalShown = false;
    public activeIndex = 0;

    private feesConfig: {
        median: number;
        fast: number;
        slow: number;
        slowest: number;
    };
    /**
     * Current account owned mosaics
     * @protected
     * @type {MosaicModel[]}
     */
    private networkBalanceMosaics: MosaicModel;

    /**
     * Whether account is currently being unlocked
     * @var {boolean}
     */
    public isUnlockingAccount: boolean = false;
    public isUnlockingLedgerAccount: boolean = false;
    public remoteAccountPrivateKey: string;
    public vrfPrivateKey: string;

    /**
     * signle key link transaction type
     * @var {string}
     */
    private type: string;
    private password: string;
    private linkIcon: string = officialIcons.publicChain;
    private showModalImportKey: boolean = false;
    private modalImportKeyTitle: string = '';

    protected isLinkingKeys = false;
    protected isActivatingHarvesting = false;
    protected hasNodeKeyChange: boolean = false;
    protected hasAccountKeyChange: boolean = false;
    protected hasVrfKeyChange: boolean = false;

    /// region computed properties
    public get minHarvesterBalance() {
        if (!MIN_HARVESTER_BALANCE || MIN_HARVESTER_BALANCE < 0) {
            return 2000;
        }

        return MIN_HARVESTER_BALANCE / Math.pow(10, 6);
    }

    public get allNodeListUrl() {
        return this.$store.getters['app/explorerUrl'] + 'nodes';
    }

    public get activePanel() {
        return this.activeIndex;
    }

    public set activePanel(panel) {
        if (panel === 1) {
            this.showConfirmModal = true;
        } else if (panel === -1) {
            this.activeIndex = 1;
        } else {
            this.activeIndex = panel;
        }
    }

    public get isActivatedFromAnotherDevice(): boolean {
        if (!this.currentSignerAccountInfo || !this.currentSignerAccountInfo.supplementalPublicKeys) {
            return false;
        }
        return (
            !this.formItems.nodeModel.url &&
            ((!this.currentSignerHarvestingModel.encRemotePrivateKey && !!this.currentSignerAccountInfo.supplementalPublicKeys.linked) ||
                (!this.currentSignerHarvestingModel.encVrfPrivateKey && !!this.currentSignerAccountInfo.supplementalPublicKeys.vrf))
        );
    }

    public get isAllKeysLinked(): boolean {
        return this.isNodeKeyLinked && this.isVrfKeyLinked && this.isAccountKeyLinked;
    }

    protected get isAccountKeyLinked(): boolean {
        return !!this.currentSignerAccountInfo?.supplementalPublicKeys.linked;
    }

    protected get isVrfKeyLinked(): boolean {
        return !!this.currentSignerAccountInfo?.supplementalPublicKeys.vrf;
    }

    protected get isNodeKeyLinked(): boolean {
        return !!this.currentSignerAccountInfo?.supplementalPublicKeys.node;
    }

    public get hasAccountUnlockModal(): boolean {
        return this.isUnlockingAccount;
    }

    public set hasAccountUnlockModal(f: boolean) {
        this.isUnlockingAccount = f;
    }

    public get hasLedgerAccountUnlockModal(): boolean {
        return this.isUnlockingLedgerAccount;
    }

    public set hasLedgerAccountUnlockModal(f: boolean) {
        this.isUnlockingLedgerAccount = f;
    }

    public get currentSignerAccount() {
        return PublicAccount.createFromPublicKey(this.currentSignerPublicKey, this.networkType);
    }

    private get isPersistentDelReqSent() {
        return this.currentSignerHarvestingModel?.isPersistentDelReqSent;
    }

    public get isLedger(): boolean {
        return this.currentAccount.type === AccountType.LEDGER || this.currentAccount.type === AccountType.LEDGER_OPT_IN;
    }

    public get isPublicAndPrivateKeysLinked(): boolean {
        if (
            (this.isAccountKeyLinked && !this.currentSignerHarvestingModel?.encRemotePrivateKey) ||
            (this.isVrfKeyLinked && !this.currentSignerHarvestingModel?.encVrfPrivateKey)
        ) {
            return false;
        }
        return true;
    }

    protected get LowFeeValue() {
        return this.formItems.maxFee === 0 || this.formItems.maxFee === 1 || this.formItems.maxFee === 5;
    }
    /// end-region computed properties

    /**
     * Reset the form with properties
     * @return {void}
     */
    protected resetForm() {
        // - set default form values
        this.action = HarvestingAction.START;
        this.newVrfKeyAccount = Account.generateNewAccount(this.networkType);
        this.newRemoteAccount = Account.generateNewAccount(this.networkType);
        this.tempAccount = Account.generateNewAccount(this.networkType);
        this.tempTransactionSigner = new AccountTransactionSigner(this.tempAccount);
    }

    @Watch('currentSignerAccountInfo', { immediate: true })
    private currentSignerWatch() {
        this.formItems.signerAddress = this.signerAddress || this.currentSignerAccountInfo?.address.plain();

        // reads node key details from store or reset
        if (this.isNodeKeyLinked) {
            this.formItems.nodeModel.nodePublicKey = this.currentSignerAccountInfo?.supplementalPublicKeys.node.publicKey;
            if (this.currentSignerHarvestingModel?.selectedHarvestingNode) {
                this.formItems.nodeModel = this.currentSignerHarvestingModel.selectedHarvestingNode;
            }
        } else {
            this.formItems.nodeModel = { nodePublicKey: '' } as NodeModel;
        }

        return this.formItems;
    }

    @Watch('formItems.nodeModel', { immediate: true })
    private nodeModelChanged() {
        // updates selected harvesting as it matches with harvesting info
        if (
            this.isActivatedFromAnotherDevice &&
            this.formItems.nodeModel &&
            this.formItems.nodeModel.url &&
            this.formItems.nodeModel.nodePublicKey === this.currentSignerAccountInfo?.supplementalPublicKeys.node.publicKey
        ) {
            const accountAddress = this.currentSignerHarvestingModel.accountAddress;
            this.$store.dispatch('harvesting/UPDATE_ACCOUNT_SELECTED_HARVESTING_NODE', {
                accountAddress,
                selectedHarvestingNode: this.formItems.nodeModel,
            });
        }

        return this.formItems;
    }

    public decryptKeys(password?: Password) {
        if (
            this.currentSignerHarvestingModel?.encRemotePrivateKey &&
            this.currentSignerHarvestingModel?.encVrfPrivateKey &&
            this.action == HarvestingAction.ACTIVATE
        ) {
            this.remoteAccountPrivateKey = Crypto.decrypt(this.currentSignerHarvestingModel?.encRemotePrivateKey, password.value);
            this.vrfPrivateKey = Crypto.decrypt(this.currentSignerHarvestingModel?.encVrfPrivateKey, password.value);
        }
        return (this.password = password.value);
    }

    private calculateSuggestedMaxFee(transaction: Transaction): Transaction {
        const feeMultiplier = this.resolveFeeMultipler(transaction);
        if (!feeMultiplier) {
            return transaction;
        }
        if (transaction instanceof AggregateTransaction) {
            // @ts-ignore
            return transaction.setMaxFeeForAggregate(feeMultiplier, this.requiredCosignatures);
        } else {
            return transaction.setMaxFee(feeMultiplier);
        }
    }

    private resolveFeeMultipler(transaction: Transaction): number | undefined {
        if (transaction.maxFee.compact() === 10) {
            const fees = this.transactionFees.minFeeMultiplier + this.transactionFees.averageFeeMultiplier * 0.65;
            return fees || this.networkConfiguration.defaultDynamicFeeMultiplier;
        }
        // fast
        if (transaction.maxFee.compact() === 20) {
            const fees =
                this.transactionFees.averageFeeMultiplier < this.transactionFees.minFeeMultiplier
                    ? this.transactionFees.minFeeMultiplier
                    : this.transactionFees.averageFeeMultiplier;
            return fees || this.networkConfiguration.defaultDynamicFeeMultiplier;
        }
        // slowest
        if (transaction.maxFee.compact() === 1) {
            const fees = this.transactionFees.minFeeMultiplier;
            return fees || this.networkConfiguration.defaultDynamicFeeMultiplier;
        }
        // slow
        if (transaction.maxFee.compact() === 5) {
            const fees = this.transactionFees.minFeeMultiplier + this.transactionFees.averageFeeMultiplier * 0.35;
            return fees || this.networkConfiguration.defaultDynamicFeeMultiplier;
        }
        return undefined;
    }

    public saveVrfKey(accountAddress: string, encVrfPrivateKey: string) {
        this.$store.dispatch('harvesting/UPDATE_VRF_ACCOUNT_PRIVATE_KEY', { accountAddress, encVrfPrivateKey });
    }

    public saveRemoteKey(accountAddress: string, encRemotePrivateKey: string) {
        this.$store.dispatch('harvesting/UPDATE_REMOTE_ACCOUNT_PRIVATE_KEY', { accountAddress, encRemotePrivateKey });
    }

    public updateHarvestingRequestStatus(accountAddress: string, delegatedHarvestingRequestFailed: boolean) {
        this.$store.dispatch('harvesting/UPDATE_HARVESTING_REQUEST_STATUS', { accountAddress, delegatedHarvestingRequestFailed });
    }

    /// region protected API
    protected createAccountKeyLinkTx(publicKey: string, linkAction: LinkAction, maxFee: UInt64): AccountKeyLinkTransaction {
        return AccountKeyLinkTransaction.create(this.createDeadline(), publicKey, linkAction, this.networkType, maxFee);
    }

    protected createVrfKeyLinkTx(publicKey: string, linkAction: LinkAction, maxFee: UInt64): VrfKeyLinkTransaction {
        return VrfKeyLinkTransaction.create(this.createDeadline(), publicKey, linkAction, this.networkType, maxFee);
    }

    protected createNodeKeyLinkTx(publicKey: string, linkAction: LinkAction, maxFee: UInt64): NodeKeyLinkTransaction {
        return NodeKeyLinkTransaction.create(this.createDeadline(), publicKey, linkAction, this.networkType, maxFee);
    }

    /**
     * To get persistent delegation request transaction
     */
    protected getPersistentDelegationRequestTransaction(transactionSigner: TransactionSigner = this.tempTransactionSigner): Transaction[] {
        const maxFee = UInt64.fromUint(this.formItems.maxFee) || UInt64.fromUint(this.feesConfig.fast);
        if (this.action !== HarvestingAction.STOP) {
            const persistentDelegationReqTx = PersistentDelegationRequestTransaction.createPersistentDelegationRequestTransaction(
                Deadline.create(this.epochAdjustment, this.isMultisigMode() ? 24 : 2),
                this.remoteAccountPrivateKey || this.newRemoteAccount.privateKey,
                this.vrfPrivateKey || this.newVrfKeyAccount.privateKey,
                this.formItems.nodeModel.nodePublicKey,
                this.networkType,
                maxFee,
            );

            return [persistentDelegationReqTx];
        }
        return [];
    }

    /**
     * To get singular AccountKeyLink, VrfKeyLink or NodeKeyLink transaction
     */
    protected getSingleKeyLinkTransaction(type?: string): Transaction[] {
        const maxFee = UInt64.fromUint(this.formItems.maxFee) || UInt64.fromUint(this.feesConfig.fast);

        if (type === 'account') {
            this.remotePrivateKeyTemp = this.newRemoteAccount?.privateKey;
            return [
                this.createAccountKeyLinkTx(
                    this.isAccountKeyLinked
                        ? this.currentSignerAccountInfo.supplementalPublicKeys.linked?.publicKey
                        : this.newRemoteAccount.publicKey,
                    this.isAccountKeyLinked ? LinkAction.Unlink : LinkAction.Link,
                    maxFee,
                ),
            ];
        } else if (type === 'vrf') {
            this.vrfPrivateKeyTemp = this.newVrfKeyAccount?.privateKey;
            return [
                this.createVrfKeyLinkTx(
                    this.isVrfKeyLinked
                        ? this.currentSignerAccountInfo.supplementalPublicKeys.vrf?.publicKey
                        : this.newVrfKeyAccount.publicKey,
                    this.isVrfKeyLinked ? LinkAction.Unlink : LinkAction.Link,
                    maxFee,
                ),
            ];
        }

        return [
            this.createNodeKeyLinkTx(
                this.isNodeKeyLinked
                    ? this.currentSignerAccountInfo.supplementalPublicKeys.node?.publicKey
                    : this.formItems.nodeModel.nodePublicKey,
                this.isNodeKeyLinked ? LinkAction.Unlink : LinkAction.Link,
                maxFee,
            ),
        ];
    }

    /**
     * To get all the key link transactions (AccountKeyLink, VrfKeyLink and/or NodeKeyLink)
     */
    protected getKeyLinkTransactions(transactionSigner = this.tempTransactionSigner): Transaction[] {
        const maxFee = UInt64.fromUint(this.formItems.maxFee) || UInt64.fromUint(this.feesConfig.fast);
        const txs: Transaction[] = [];

        // unlinks [all] linked keys
        if (this.action === HarvestingAction.STOP) {
            if (this.isAccountKeyLinked || !this.currentSignerHarvestingModel?.encRemotePrivateKey) {
                const accountUnlinkTx = this.createAccountKeyLinkTx(
                    this.currentSignerAccountInfo.supplementalPublicKeys?.linked.publicKey,
                    LinkAction.Unlink,
                    maxFee,
                );
                txs.push(accountUnlinkTx);
            }
            if (this.isVrfKeyLinked || !this.currentSignerHarvestingModel?.encRemotePrivateKey) {
                const vrfUnlinkTx = this.createVrfKeyLinkTx(
                    this.currentSignerAccountInfo.supplementalPublicKeys?.vrf.publicKey,
                    LinkAction.Unlink,
                    maxFee,
                );
                txs.push(vrfUnlinkTx);
            }
            if (this.isNodeKeyLinked) {
                const nodeUnLinkTx = this.createNodeKeyLinkTx(
                    this.currentSignerAccountInfo.supplementalPublicKeys?.node.publicKey,
                    LinkAction.Unlink,
                    maxFee,
                );
                txs.push(nodeUnLinkTx);
            }
        }
        // links [all] keys
        else {
            if (!this.isAccountKeyLinked) {
                const accountKeyLinkTx = this.createAccountKeyLinkTx(this.newRemoteAccount.publicKey, LinkAction.Link, maxFee);
                txs.push(accountKeyLinkTx);
            }

            if (!this.isVrfKeyLinked) {
                const vrfKeyLinkTx = this.createVrfKeyLinkTx(this.newVrfKeyAccount.publicKey, LinkAction.Link, maxFee);
                txs.push(vrfKeyLinkTx);
            }

            if (!this.isNodeKeyLinked) {
                const nodeLinkTx = this.createNodeKeyLinkTx(this.formItems.nodeModel.nodePublicKey, LinkAction.Link, maxFee);
                txs.push(nodeLinkTx);
            }
        }

        if (!txs.length) {
            return [];
        }

        if (this.action === HarvestingAction.START) {
            this.remotePrivateKeyTemp = this.newRemoteAccount?.privateKey;
            this.vrfPrivateKeyTemp = this.newVrfKeyAccount?.privateKey;
        }

        if (!this.isMultisigMode()) {
            const aggregate = AggregateTransaction.createComplete(
                Deadline.create(this.epochAdjustment),
                txs.map((t) => t.toAggregate(this.currentSignerAccount)),
                this.networkType,
                [],
                maxFee,
            );
            return [aggregate];
        }

        return txs;
    }

    /**
     * Getter for HARVESTING transactions that will be staged
     * @see {FormTransactionBase}
     * @return {TransferTransaction[]}
     */
    protected getTransactions(): Transaction[] {
        if (this.action === HarvestingAction.ACTIVATE) {
            return this.getPersistentDelegationRequestTransaction();
        } else if (this.action === HarvestingAction.SINGLE_KEY) {
            return this.getSingleKeyLinkTransaction(this.type);
        } else {
            return this.getKeyLinkTransactions();
        }
    }
    /// end-region protected API

    /// region event listeners
    public onSingleKeyOperation(type: string) {
        this.action = HarvestingAction.SINGLE_KEY;
        this.type = type;

        // also show modal box if keys imported
        if (this.type === 'account' && !this.isAccountKeyLinked) {
            this.modalImportKeyTitle = PublicKeyTitle.REMOTE;
            this.showModalImportKey = true;
        } else if (this.type === 'vrf' && !this.isVrfKeyLinked) {
            this.modalImportKeyTitle = PublicKeyTitle.VRF;
            this.showModalImportKey = true;
        }

        return this.onSubmit();
    }

    public onSubmitPrivateKey(accountObject: { account: Account; type: string }) {
        // if using HW, unlock with HW
        if (this.isLedger) {
            this.hasLedgerAccountUnlockModal = true;
            return;
        }

        // store copy of accounts being linked
        if (accountObject.type === 'vrf') {
            this.newVrfKeyAccount = accountObject.account;
        } else if (accountObject.type === 'account') {
            this.newRemoteAccount = accountObject.account;
        }

        return this.onSubmit();
    }

    /**
     * Listener called when the form is being submitted. This method checks for
     * invalid nodes for harvesting and stores state changes about key changes.
     *
     * This method also prepares a transaction command and ask the end-user for
     * confirmation using `ModalTransactionConfirmation`.
     *
     * @see {FormTransactionBase.onSubmit}
     */
    public onSubmit() {
        // bail out on invalid node
        if (
            !this.isAllKeysLinked &&
            !this.formItems.nodeModel.nodePublicKey.length &&
            ((this.action == HarvestingAction.SINGLE_KEY && this.type == 'node') || this.action == HarvestingAction.START)
        ) {
            this.$store.dispatch('notification/ADD_ERROR', this.$t('invalid_node'));
            return;
        }

        // keeps state about key changes
        switch (this.action) {
            case HarvestingAction.SINGLE_KEY:
                this.hasNodeKeyChange = this.type === 'node';
                this.hasAccountKeyChange = this.type === 'account';
                this.hasVrfKeyChange = this.type === 'vrf';
                break;

            case HarvestingAction.ACTIVATE:
                Vue.set(this, 'isActivatingHarvesting', true);
                break;

            default:
            case HarvestingAction.START:
            case HarvestingAction.STOP:
                this.hasNodeKeyChange = !this.isNodeKeyLinked;
                this.hasAccountKeyChange = !this.isAccountKeyLinked;
                this.hasVrfKeyChange = !this.isVrfKeyLinked;
                break;
        }

        // updates component state
        if (this.hasNodeKeyChange || this.hasAccountKeyChange || this.hasVrfKeyChange) {
            Vue.set(this, 'isLinkingKeys', true);
        }

        // open signature modal
        this.command = this.createTransactionCommand();
        this.onShowConfirmationModal();
    }

    /**
     * Listener called when FormTransactionBase emits a `on-confirmation-success`
     * event which means the transactions were [successfully] signed.
     *
     * Broadcating is yet to happen in a parallel thread.
     *
     * @see {FormTransactionBase.onConfirmationSuccess}
     */
    public onHarvestingActionSubmitted() {
        const accountAddress = this.currentSignerHarvestingModel.accountAddress;

        // if we had a remote key change, save it
        if (this.hasAccountKeyChange) {
            let encRemotePrivateKey = null;
            if (!!this.remotePrivateKeyTemp) {
                encRemotePrivateKey = Crypto.encrypt(this.remotePrivateKeyTemp, this.password);
            }

            this.saveRemoteKey(accountAddress, encRemotePrivateKey);
            this.hasAccountKeyChange = false;
        }

        // if we had a vrf key change, save it
        if (this.hasVrfKeyChange) {
            let encVrfPrivateKey = null;
            if (!!this.vrfPrivateKeyTemp) {
                encVrfPrivateKey = Crypto.encrypt(this.vrfPrivateKeyTemp, this.password);
            }

            this.saveVrfKey(accountAddress, encVrfPrivateKey);
            this.hasVrfKeyChange = false;
        }

        // if we had a node key change, restart polling
        if (this.hasNodeKeyChange) {
            this.$store.dispatch('harvesting/SET_POLLING_TRIALS', 1);
            this.updateHarvestingRequestStatus(accountAddress, false); // "failed" = false
            this.hasNodeKeyChange = false;
        }

        // updates harvesting request state and node details
        if (this.action === HarvestingAction.ACTIVATE) {
            this.$store.dispatch('harvesting/UPDATE_ACCOUNT_IS_PERSISTENT_DEL_REQ_SENT', {
                accountAddress,
                isPersistentDelReqSent: true,
            });

            Vue.set(this, 'isActivatingHarvesting', false);
        } else {
            this.$store.dispatch('harvesting/UPDATE_ACCOUNT_IS_PERSISTENT_DEL_REQ_SENT', {
                accountAddress,
                isPersistentDelReqSent: false,
            });

            // stores selected [successfull] harvesting node
            this.$store.dispatch('harvesting/UPDATE_ACCOUNT_SELECTED_HARVESTING_NODE', {
                accountAddress,
                selectedHarvestingNode: this.formItems.nodeModel,
            });

            Vue.set(this, 'isLinkingKeys', false);
        }
    }

    /**
     * When account is unlocked, the sub account can be created
     */
    public async onAccountUnlocked(account: Account, password: Password) {
        try {
            this.password = password.value;
            this.action = HarvestingAction.ACTIVATE;
            this.remoteAccountPrivateKey = Crypto.decrypt(this.currentSignerHarvestingModel?.encRemotePrivateKey, password.value);
            this.vrfPrivateKey = Crypto.decrypt(this.currentSignerHarvestingModel?.encVrfPrivateKey, password.value);
            return this.onSubmit();
        } catch (e) {
            if (!this.currentSignerHarvestingModel?.encRemotePrivateKey || !this.currentSignerHarvestingModel?.encVrfPrivateKey) {
                this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please relink your vrf and remote keys.');
            } else {
                this.$store.dispatch('notification/ADD_ERROR', 'An error happened, please try again.');
            }

            console.error(e);
        }
    }

    public async onLedgerAccountUnlocked(account: Account, password: Password) {
        this.password = password.value;
        this.onSubmit();
    }

    public onStart() {
        this.action = HarvestingAction.START;

        // checks for min balance
        if (this.networkBalanceMosaics.balance / Math.pow(10, this.networkBalanceMosaics.divisibility) < this.minHarvesterBalance) {
            this.$store.dispatch('notification/ADD_ERROR', this.$t('harvesting_account_insufficient_balance'));
            return;
        }

        // checks for non-zero importance
        if (
            this.accountsInfo.find((k) => k.address.plain() === this.currentSignerHarvestingModel.accountAddress).importance.compact() === 0
        ) {
            this.$store.dispatch('notification/ADD_ERROR', this.$t('harvesting_account_has_zero_importance'));
            return;
        }

        // trigger unlock window for HW
        if (this.isLedger) {
            this.hasLedgerAccountUnlockModal = true;
            return;
        }

        // prepare harvesting action submission
        return this.onSubmit();
    }

    public onStop() {
        this.action = HarvestingAction.STOP;
        this.onSubmit();
    }

    public onStartClick() {
        if (this.activePanel === 1) {
            this.onConfirmStart();
        } else {
            this.isDelegatedHarvestingWarningModalShown = true;
        }
    }

    public onConfirmStart() {
        this.isDelegatedHarvestingWarningModalShown = false;
        this.onStart();
    }

    public onActivate() {
        this.hasAccountUnlockModal = true;
    }
    /// end-region event listeners´
}
