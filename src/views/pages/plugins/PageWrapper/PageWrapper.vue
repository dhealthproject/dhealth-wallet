<template>
    <div v-if="!!selectedPlugin" class="plugin-page-container">
        <div v-if="pluginComponent !== null">
            <Component :is="pluginComponent" @prepared="onTransactionPrepared"></Component>
        </div>
        <div v-else>
            <span>This plugin does not include a page.</span>
        </div>

        <ModalTransactionConfirmation
            v-if="hasConfirmationModal && !!command"
            :command="command"
            :visible="hasConfirmationModal && !!command"
            @transaction-signed="onSignedOfflineTransaction"
            @success="onConfirmationSuccess"
            @error="onConfirmationError"
            @close="onConfirmationCancel"
        />
    </div>
</template>

<script lang="ts">
import { PageWrapperTs } from './PageWrapperTs';
export default class PageWrapper extends PageWrapperTs {}
</script>
<style lang="less" scoped>
@import './PageWrapper.less';
</style>
