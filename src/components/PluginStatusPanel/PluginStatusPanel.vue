<template>
    <div class="plugin-status-wrapper">
        <div class="plugin-status-inner-container">
            <div class="status-container">
                <div class="title">
                    <span class="title_txt">{{ $t('plugins_panel_status') }}</span>
                </div>
                <div class="level">
                    <div class="level-left">
                        <div class="level-item">
                            <div :class="pluginStatusIndicator.cls"></div>
                        </div>
                        <div class="level-item txt-small">{{ pluginStatusIndicator.text }}</div>
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
