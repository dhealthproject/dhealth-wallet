<template>
    <div v-if="!!selectedPlugin" class="dashboard-container">
        <div class="dashboard-left-container">
            <div class="dashboard-top-left-container">
                <PluginStatusPanel
                    @on-clicked-enable="requestEnablePlugin"
                    @on-clicked-disable="requestDisablePlugin"
                    @on-clicked-start="requestStartPlugin"
                />
            </div>
            <div class="dashboard-bottom-left-container">
                <PluginDetailMultiPanel :plugin="selectedPlugin" @on-clicked-readme="openReadme" />
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

        <ModalConfirm
            v-model="showConfirmOpenPluginStatusChangeModal"
            :title="$t('modal_title_confirm_plugin_status_change')"
            :message="$t('modal_text_confirm_plugin_status_change')"
            :use-bigger-font="true"
            @confirmed="showPluginStatusChangeModal = true"
            @cancelled="nextPluginStatus = null"
        />

        <ModalConfirm
            v-model="showConfirmOpenPluginPageModal"
            :title="$t('modal_title_confirm_plugin_page')"
            :message="$t('modal_text_confirm_plugin_page')"
            :use-bigger-font="true"
            @confirmed="$router.push({ name: 'plugins.page' })"
        />

        <ModalConfirm
            v-model="showConfirmReloadPageModel"
            :title="$t('modal_title_confirm_plugin_status_reload_page')"
            :message="$t('modal_text_confirm_plugin_status_reload_page')"
            :use-bigger-font="true"
            :show-cancel="false"
            :warning="true"
            @confirmed="onConfirmReloadPage"
        />

        <ModalPluginStatusChange
            v-if="showPluginStatusChangeModal"
            :visible="showPluginStatusChangeModal"
            :title="$t('modal_title_plugin_status_change')"
            :status="nextPluginStatus"
            @confirmed="confirmStatusChange"
            @cancelled="showPluginStatusChangeModal = false"
        />
    </div>
</template>

<script lang="ts">
import { InfoTs } from './InfoTs';
export default class Info extends InfoTs {}
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
