<template>
    <div class="transaction-row-container transaction-row-columns" @click="$emit('click', transaction)">
        <!-- FIRST COLUMN -->
        <div class="icon-cell">
            <img :src="getIcon()" class="icon-cell-image" />
        </div>

        <!-- SECOND COLUMN -->
        <div class="address-cell">
            <ActionDisplay
                :transaction="transaction"
                :aggregate-transaction-sender-address="
                    aggregateTransactionDetails &&
                    aggregateTransactionDetails.innerTransactions &&
                    !!aggregateTransactionDetails.innerTransactions.length &&
                    aggregateTransactionDetails.innerTransactions[0].signer.address
                "
            />
        </div>

        <!-- THIRD COLUMN -->
        <div class="amount-cell">
            <MosaicAmountDisplay
                v-if="getAmount() !== undefined"
                :id="getAmountMosaicId()"
                :absolute-amount="getAmount()"
                :color="getAmountColor()"
                :show-ticker="isAmountShowTicker()"
            />
            <span v-else>N/A</span>
        </div>

        <!-- FOURTH COLUMN -->
        <div class="confirmation-cell">
            {{ getHeight() }}
        </div>

        <!-- FIFTH COLUMN -->
        <div class="hash-cell">
            <!--
            <span class="hash-cell-transaction-hash">
                <a class="url_text" target="_blank" :href="explorerUrl">
                    {{ formatters.miniHash(transaction.transactionInfo.hash) }}
                </a>
            </span>
            -->
            <span class="hash-cell-time">
                <!-- @TODO: Should be transaction time instead of deadline -->
                {{ date }}
            </span>
        </div>
    </div>
</template>

<script lang="ts">
// @ts-ignore
import { TransactionRowTs } from './TransactionRowTs';

export default class TransactionRow extends TransactionRowTs {}
</script>
