<template>
    <div v-if="!!selectedPlugin" class="dashboard-container">
        <div class="dashboard-left-container">
            <div class="dashboard-top-left-container">
                <PluginStatusPanel />
            </div>
            <div class="dashboard-bottom-left-container">
                <PluginDetailMultiPanel
                  @on-clicked-readme="console.log('should display readme modal')" />
            </div>
        </div>
        <div class="dashboard-right-container">
            <div class="title">
                <span class="title_txt">{{ $t('sidebar_title_plugin_details') }}</span>
            </div>
            <div class="plugin-information">
                <PluginInformationSidebar :plugin="selectedPlugin" />
            </div>
        </div>
    </div>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// child components
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';
import PluginDetailMultiPanel from '@/components/PluginDetailMultiPanel/PluginDetailMultiPanel.vue';
import PluginStatusPanel from '@/components/PluginStatusPanel/PluginStatusPanel.vue';
import PluginInformationSidebar from '@/components/PluginInformationSidebar/PluginInformationSidebar.vue';

@Component({
    components: { NavigationTabs, PluginDetailMultiPanel, PluginStatusPanel, PluginInformationSidebar },
    computed: {
        ...mapGetters({
            selectedPlugin: 'plugin/currentPlugin',
        }),
    },
    data() {
        return {};
    },
})
export default class Info extends Vue {}
</script>
<style lang="less" scoped>
@import './Info.less';

.header-container-placeholder {
    padding: 0 0.4rem;
    margin: 0.2rem 0;
    .section-title {
        font-weight: 600;
        color: @purpleDark;
        font-family: @symbolFont;
    }
}
</style>
