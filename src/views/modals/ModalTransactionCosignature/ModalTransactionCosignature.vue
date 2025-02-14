<template>
    <div class="transaction_modal">
        <Modal
            v-model="show"
            class-name="modal-transaction-cosignature"
            :title="$t('modal_title_transaction_details')"
            :transfer="false"
            :footer-hide="true"
            @close="show = false"
        >
            <div class="transaction-details-content">
                <TransactionDetails :transaction="transaction" />

                <div v-if="cosignatures && cosignatures.length">
                    <div class="explain">
                        <span class="subtitle">{{ $t('transaction_has_cosignature') }}</span>
                        <div
                            v-for="(cosignature, index) in cosignatures"
                            :key="index"
                            class="row-cosignatory-modification-display-cosignature accent-pink-background inputs-container mx-1"
                        >
                            <div>
                                <Icon :type="'md-checkbox-outline'" size="20" />
                                <span>{{ $t('label_signed_by') }}</span>
                                <span>
                                    <b>
                                        {{ cosignature.signer.publicKey }}
                                    </b>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="hasMissSignatures">
                    <div v-if="!needsCosignature">
                        <div class="explain">
                            <span class="subtitle">{{ $t('transaction_needs_cosignature') }}</span>
                            <div class="explain-qr">
                                <p>{{ $t('transaction_needs_cosignature_explain_signed') }}</p>
                                <QRCodeDisplay
                                    :qr-code="cosignatureQrCode"
                                    show-download="true"
                                    :download-name="'cosginatureqr_' + transaction.signer.address.plain()"
                                    header="Cosignature QR Code"
                                />
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="explain">
                            <span class="subtitle">{{ $t('transaction_needs_cosignature') }}</span>
                            <p>{{ $t('transaction_needs_cosignature_explain') }}</p>
                            <span v-if="!hideCosignerWarning" class="warning">
                                <Alert type="warning" show-icon>
                                    <div class="warning-row emphasis">
                                        {{ $t('transaction_cosignature_warning_unknown_cosigner') }}
                                    </div>
                                    <div class="warning-row">
                                        {{ $t('transaction_cosignature_warning_dont_sign') }}
                                    </div>
                                    <div class="inputs-container emphasis">
                                        <Checkbox v-model="wantToProceed">
                                            {{ $t('transaction_cosignature_warning_proceed') }}
                                        </Checkbox>
                                    </div>
                                </Alert>
                            </span>
                        </div>

                        <HardwareConfirmationButton v-if="isUsingHardwareWallet" @success="onSigner" @error="onError" />
                        <FormProfileUnlock
                            v-else
                            :disabled="!hideCosignerWarning && !wantToProceed"
                            @success="onAccountUnlocked"
                            @error="onError"
                        />
                    </div>
                </div>
                <div v-else-if="expired">
                    <div class="explain">
                        <span class="subtitle">{{ $t('transaction_expired') }}</span>
                    </div>
                </div>
                <div v-else-if="!isLoading">
                    <div class="explain">
                        <span class="subtitle">{{ $t('transaction_received_cosignature_explain') }}</span>
                    </div>
                </div>
                <Spin v-if="isLoading" size="large" fix class="absolute" />
            </div>
        </Modal>
    </div>
</template>

<script lang="ts">
import { ModalTransactionCosignatureTs } from './ModalTransactionCosignatureTs';
export default class ModalTransactionCosignature extends ModalTransactionCosignatureTs {}
</script>
<style lang="less" scoped>
@import './ModalTransactionCosignature.less';
</style>
