<template>
    <div
        :class="{
            'table-container': true,
            'without-header': disableHeaders,
        }"
    >
        <!-- PRE-HEADER (ACTIONS) -->
        <div v-if="canRefresh || (!!actionButtons && actionButtons.length)" class="upper-section-container">
            <div class="table-title-container section-title">
                <div class="user-operation">
                    <!-- ACTION BUTTONS -->
                    <div
                        v-for="({ id, label, icon }, index) in actionButtons"
                        :key="index"
                        :class="['table-action-button-wrapper', `${name}-action-button`]"
                    >
                        <IconButton
                            class="align-right"
                            size="18"
                            :icon="icon"
                            :title="$t(`table_action_name_${name}`)"
                            @click="$emit('on-clicked-action', id)"
                        />
                    </div>

                    <!-- REFRESH BUTTON -->
                    <ButtonRefresh v-if="canRefresh" @click="onRefresh" />
                </div>
            </div>
        </div>
        <!-- TABLE HEADER (COLUMN TITLES) -->
        <div v-if="!disableHeaders" class="table-header-container table-columns">
            <div
                v-for="({ name, label }, index) in tableFields"
                :key="index"
                :class="['table-header-item', `${name}-header`]"
                @click="setSortedBy(name)"
            >
                <span>{{ $t(label) }}</span>
                <Icon
                    v-if="sortedBy.fieldName === name"
                    class="sort-icon"
                    :type="sortedBy.direction === 'asc' ? 'md-arrow-dropup' : 'md-arrow-dropdown'"
                />
            </div>
            <!-- Empty header for the action button column -->
            <div>&nbsp;</div>
        </div>
        <!-- TABLE BODY (COLUMN TITLES) -->
        <div class="table-body-container">
            <Spin v-if="isLoading" size="large" fix class="absolute" />
            <div
                v-show="displayedValues.length"
                v-infinite-scroll="false"
                infinite-scroll-disabled="true"
                infinite-scroll-distance="5"
                class="table-rows-outer-container"
            >
                <div class="table-rows-container">
                    <GenericTableRow
                        v-for="(rowValues, index) in currentPageRows"
                        :key="index"
                        :row-values="rowValues"
                        @on-remove="$emit('on-remove', rowValues)"
                        @click="$emit('on-clicked-row', index)"
                    />
                </div>
            </div>
            <div v-if="!isLoading && (!displayedValues || displayedValues.length === 0)" class="no-data-outer-container">
                <div class="no-data-inner-container">
                    <div v-for="item in emptyColumns" :key="item">
                        &nbsp;
                    </div>
                </div>
            </div>
        </div>

        <div v-if="!disableSinglePageLinks || displayedValues.length / pageSize > 1" class="table-footer-container">
            <Page class="page" :total="displayedValues.length" :page-size="pageSize" @on-change="handlePageChange" />
        </div>
    </div>
</template>

<script lang="ts">
import { GenericTableDisplayTs } from './GenericTableDisplayTs';
export default class GenericTableDisplay extends GenericTableDisplayTs {}
</script>
<style lang="less" scoped>
@import './GenericTableDisplay.less';
</style>
