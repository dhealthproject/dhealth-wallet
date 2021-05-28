<template>
    <div class="plugin-status-wrapper">
        <div class="plugin-status-inner-container">
            <div class="status-container">
                <div class="title">
                    <span class="title_txt">{{ $t('plugins_panel_action_enable') }}</span>
                </div>
                <div class="level">
                    <div class="level-left">
                        <div class="action-wrapper">
                            <IconButton
                                v-if="pluginActionDescriptor.action"
                                :title="pluginActionDescriptor.text"
                                :size="'20'"
                                :icon="pluginActionDescriptor.icon"
                                :class="pluginActionDescriptor.cls"
                                @click="$emit(pluginActionDescriptor.event)"
                            />
                            <div v-else>
                                <span class="txt_err">{{ pluginActionDescriptor.text }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="package-container">
                <div class="title">
                    <span class="title_txt">{{ $t('plugins_panel_package') }}</span>
                </div>
                <span class="txt_info">
                    <span>
                        {{ selectedPlugin.npmModule }}
                    </span>
                </span>
            </div>

            <div class="version-container">
                <div class="title">
                    <span class="title_txt">{{ $t('plugins_panel_version') }}</span>
                </div>
                <div class="txt_info">
                    <span> v{{ selectedPlugin.version }} </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { PluginStatusPanelTs } from './PluginStatusPanelTs';
export default class PluginStatusPanel extends PluginStatusPanelTs {}
</script>
<style lang="less" scoped>
@import './PluginStatusPanel.less';
</style>
