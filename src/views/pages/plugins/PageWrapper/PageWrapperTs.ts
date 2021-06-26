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
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { TransactionURI } from 'symbol-uri-scheme';
import {
    Address,
    MosaicId,
    MultisigAccountInfo,
    NetworkType,
    SignedTransaction,
    Transaction,
    TransactionFees,
    TransactionType,
} from 'symbol-sdk';

// internal dependencies
import { TransactionCommand, TransactionCommandMode } from '@/services/TransactionCommand';
import { PluginModel } from '@/core/database/entities/PluginModel';
import { NetworkConfigurationModel } from '@/core/database/entities/NetworkConfigurationModel';
import { Signer } from '@/store/Account';

// child components
// @ts-ignore
import ModalTransactionConfirmation from '@/views/modals/ModalTransactionConfirmation/ModalTransactionConfirmation.vue';

@Component({
    components: {
        ModalTransactionConfirmation,
    },
    computed: {
        ...mapGetters({
            selectedPlugin: 'plugin/currentPlugin',
            generationHash: 'network/generationHash',
            networkType: 'network/networkType',
            epochAdjustment: 'network/epochAdjustment',
            selectedSigner: 'account/currentSigner',
            currentSignerPublicKey: 'account/currentSignerPublicKey',
            currentSignerMultisigInfo: 'account/currentSignerMultisigInfo',
            isCosignatoryMode: 'account/isCosignatoryMode',
            networkMosaic: 'mosaic/networkMosaic',
            networkConfiguration: 'network/networkConfiguration',
            transactionFees: 'network/transactionFees',
        }),
    },
})
export class PageWrapperTs extends Vue {
    /// region store getters
    /**
     * The currently selected plugin.
     * @var {PluginModel}
     */
    public selectedPlugin: PluginModel;

    /**
     * Network generation hash
     */
    protected generationHash: string;

    /**
     * Network type
     */
    protected networkType: NetworkType;

    /**
     * The network configuration epochAdjustment.
     */
    protected epochAdjustment: number;

    /**
     * Currently active signer
     */
    protected selectedSigner: Signer;

    /**
     * Currently active signer's public key
     */
    protected currentSignerPublicKey: string;

    /**
     * Currently active signer's address
     */
    protected currentSignerAddress: Address;

    /**
     * Current signer multisig info
     */
    protected currentSignerMultisigInfo: MultisigAccountInfo;

    /**
     * Whether the form is in cosignatory mode (cosigner selected)
     */
    protected isCosignatoryMode: boolean;

    /**
     * Networks currency mosaic
     */
    protected networkMosaic: MosaicId;

    /**
     * Networks properties
     */
    protected networkConfiguration: NetworkConfigurationModel;

    /**
     * Networks transaction fees
     */
    protected transactionFees: TransactionFees;
    /// end-region store getters

    /**
     * Whether the page is displaying or not the confirm modal
     * @var {boolean}
     */
    public hasConfirmationModal: boolean = false;

    /**
     * A prepared transaction command.
     * @var {TransactionCommand}
     */
    public command: TransactionCommand;

    /// region computed properties
    public get pluginComponent(): string {
        if (!this.selectedPlugin) {
            return null;
        }

        const components = this.selectedPlugin.components;
        if (!components.length) {
            return null;
        }

        // Try to display "view" component ("index page")
        if (this.selectedPlugin.view && this.selectedPlugin.view.length) {
            return this.selectedPlugin.view;
        }

        // Given no view, display *first* component
        const component = components[0];
        return component;
    }

    protected get requiredCosignatures() {
        return this.currentSignerMultisigInfo ? this.currentSignerMultisigInfo.minApproval : this.selectedSigner.requiredCosignatures;
    }

    /**
     * Getter for whether forms should aggregate transactions in BONDED
     * @return {boolean}
     */
    protected isMultisigMode(): boolean {
        return this.isCosignatoryMode === true;
    }
    /// end-region computed properties

    /// region component methods
    public onTransactionPrepared(transaction: TransactionURI<Transaction>) {
        this.command = this.createTransactionCommand(transaction.toTransaction());
        this.hasConfirmationModal = true;
    }

    public onConfirmationSuccess() {
        this.hasConfirmationModal = false;
        this.command = null;
    }

    public onConfirmationError(error: string) {
        this.$store.dispatch('notification/ADD_ERROR', error);
    }

    public onConfirmationCancel() {
        this.hasConfirmationModal = false;
    }

    public onSignedOfflineTransaction(signedTransaction: SignedTransaction) {
        this.$emit('signed', signedTransaction);
    }
    /// end-region computed properties

    /// region private API
    private createTransactionCommand(transaction: Transaction): TransactionCommand {
        const mode = this.getTransactionCommandMode(transaction);
        return new TransactionCommand(
            mode,
            this.selectedSigner,
            this.currentSignerPublicKey,
            [transaction],
            this.networkMosaic,
            this.generationHash,
            this.networkType,
            this.epochAdjustment,
            this.networkConfiguration,
            this.transactionFees,
            this.requiredCosignatures,
        );
    }

    private getTransactionCommandMode(transaction: Transaction): TransactionCommandMode {
        const isAggregate = [TransactionType.AGGREGATE_COMPLETE, TransactionType.AGGREGATE_BONDED].includes(transaction.type);

        if (this.isCosignatoryMode) {
            return TransactionCommandMode.MULTISIGN;
        } else if (isAggregate) {
            return TransactionCommandMode.AGGREGATE;
        }

        return TransactionCommandMode.SIMPLE;
    }
    /// end-region private API
}
