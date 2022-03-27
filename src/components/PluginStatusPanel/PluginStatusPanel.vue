<template>
    <div class="plugin-status-wrapper">
        <div
            :class="{
                'plugin-status-inner-container': true,
                'justify-center': !pluginUsageDescriptor.action,
            }"
        >
            <div class="status-container">
                <div class="title">
                    <span class="title_txt">{{ pluginActionDescriptor.label }}</span>
                </div>
                <div class="level align-center">
                    <div class="level-center">
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

            <div v-if="pluginUsageDescriptor.action" class="version-container">
                <div class="title">
                    <span class="title_txt">{{ $t('plugins_panel_usenow') }}</span>
                </div>
                <div class="level">
                    <div class="level-left">
                        <div class="action-wrapper">
                            <IconButton
                                v-if="pluginUsageDescriptor.action"
                                :title="pluginUsageDescriptor.text"
                                :size="'20'"
                                :icon="pluginUsageDescriptor.icon"
                                :class="pluginUsageDescriptor.cls"
                                @click="$emit(pluginUsageDescriptor.event)"
                            />
                            <div v-else>
                                <span class="txt_err">{{ pluginUsageDescriptor.text }}</span>
                            </div>
                        </div>
                    </div>
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
