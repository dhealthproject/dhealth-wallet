<template>
    <div class="table-row-container table-columns"
        @click="$emit('click')"
    >
        <div
            v-for="(value, name, index) in visibleRowValues"
            :key="index"
            :class="['table-cell', `${name}-cell`]"
        >
            <div v-if="isAmountField(name)">
                <AmountDisplay :value="value" />
            </div>
            <div v-else-if="isLinkField(name)">
                <a class="trigger-link pointer" :href="value" target="_blank">
                    <img class="link-icon" :src="externalLinkIcon" />
                    <span>{{ $t('plugins_open_website') }}</span>
                </a>
            </div>
            <div v-else>{{ value }}</div>
        </div>
        <div class="edit-icon-cell">
            <div v-if="showRemove" @click="$emit('on-remove', rowValues)">
                <Icon type="md-trash" class="edit-icon" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { GenericTableRowTs } from './GenericTableRowTs';

export default class GenericTableRow extends GenericTableRowTs {}
</script>

<style scoped lang="less">
/* @TODO GenericTableDisplay.less shouldn't be imported here*/
@import '../GenericTableDisplay.less';
@import './GenericTableRow.less';
</style>
