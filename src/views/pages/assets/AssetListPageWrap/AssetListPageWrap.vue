<template>
    <div class="asset-list-main-container">
        <div class="left-container">
            <div class="table-section">
                <slot name="table-section" />
            </div>
        </div>
        <div class="right-container">
            <div class="header-container">
                <div class="asset-title">Test</div>
            </div>
            <div class="bottom-container">
                <div class="asset-main-container">
                    <div class="asset-container">
                        <span>Test Beschreibung</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';
@Component({ components: { NavigationTabs } })
export default class AssetListPageWrap extends Vue {}
</script>

<style lang="less" scoped>
@import './AssetListPageWrap.less';
</style>
