<template>
    <div class="multisig-outer-container">
        <div class="multisig-inner-container">
            <div class="left-container">
                <div class="bottom-container">
                    <NavigationTabs class="multisig-tabs" direction="horizontal" :parent-route-name="'multisig'" />
                    <router-view />
                </div>
            </div>
            <div class="right-container">
                <div class="header-container">
                    <div class="multisig-title">{{ $t('multisig_sidebar_heading') }}</div>
                </div>
                <div class="bottom-container">
                    <div class="multisig-main-container">
                        <div class="multisig-container">
                            <div class="multisig-item">
                                <div class="multisig-item-heading">{{ $t('multisig_item_heading') }}</div>
                                <div class="multisig-item-content">{{ $t('multisig_item_content') }}</div>
                            </div>
                            <div class="multisig-item">
                                <div class="multisig-item-heading">{{ $t('multisig_item_heading_2') }}</div>
                                <div class="multisig-item-content">{{ $t('multisig_item_content_2') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';

@Component({
    components: { NavigationTabs },
    data() {
        return {};
    },
})
export default class MultisigDashboardPage extends Vue {}
</script>

<style lang="less" scoped>
@import '../../../resources/css/variables.less';
@import './MultisigDashboardPage.less';
</style>
