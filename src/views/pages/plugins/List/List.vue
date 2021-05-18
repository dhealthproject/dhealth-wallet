<template>
    <AssetListPageWrap class="plugin-list-container">
        <template v-slot:table-section>
            <TableDisplay
                asset-type="plugin"
                class="table-section"
                :pagination-type="'scroll'"
                :page-size="20"
                @on-clicked-row="handleClick"
            >
                <template v-slot:table-title>
                    <h1 class="section-title">
                        {{ $t('title_plugin_manager') }}
                    </h1>
                </template>
            </TableDisplay>
        </template>
    </AssetListPageWrap>
</template>

<script lang="ts">
import { ListTs } from './ListTs';
export default class List extends ListTs {}
</script>

<style lang="less" scoped>
@import './List.less';

.table-section {
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    height: 100%;
}
</style>
