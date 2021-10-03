/*
 * Copyright 2021-present [Using Blockchain Ltd](https://using-blockchain.org), All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Component, Vue, Prop } from 'vue-property-decorator';
import { PluginBridge } from '@dhealth/wallet-api-bridge';
import { PluginModel } from '@/core/database/entities/PluginModel';

// child components
// @ts-ignore
import IconButton from '@/components/IconButton/IconButton.vue';

@Component({
    components: {
        IconButton,
    },
})
export class PluginStatusPanelTs extends Vue {
    /**
     * The active plugin.
     * @var {PluginModel}
     */
    @Prop({default: null}) plugin: PluginModel;

    /**
     * Controls the checkbox state
     * @type {boolean}
     */
    private isEnabled: boolean = false;

    public get pluginActionDescriptor() {
        switch (this.plugin.status) {
            case PluginBridge.PluginInstallStatus.Installed:
                return {
                    event: 'on-clicked-enable',
                    action: true,
                    cls: 'success-button',
                    text: this.$t('plugin_action_enable_text'),
                    icon: 'md-checkmark',
                };
            case PluginBridge.PluginInstallStatus.Enabled:
                return {
                    event: 'on-clicked-disable',
                    action: true,
                    cls: 'danger-button',
                    text: this.$t('plugin_action_disable_text'),
                    icon: 'md-trash',
                };
            case PluginBridge.PluginInstallStatus.Disabled:
                return {
                    event: 'on-clicked-enable',
                    action: true,
                    cls: 'success-button',
                    text: this.$t('plugin_action_enable_text'),
                    icon: 'md-checkmark',
                };
            default:
            case PluginBridge.PluginInstallStatus.Uninstalled:
                return { action: false, text: this.$t('plugin_status_uninstalled') };
        }
    }

    public get pluginUsageDescriptor() {
        switch (this.plugin.status) {
            case PluginBridge.PluginInstallStatus.Enabled:
                return {
                    event: 'on-clicked-start',
                    action: true,
                    cls: 'success-button',
                    text: this.$t('plugin_action_start_text') + this.plugin.name,
                    icon: 'md-play',
                };

            default:
                return { action: false, text: this.$t('plugin_status_notusable') };
        }
    }
}
