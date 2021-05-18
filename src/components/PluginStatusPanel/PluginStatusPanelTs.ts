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
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

import { PluginInstallStatus, PluginModel } from '@/core/database/entities/PluginModel';
@Component({
    computed: {
        ...mapGetters({
            selectedPlugin: 'plugin/currentPlugin',
        }),
    },
})
export class PluginStatusPanelTs extends Vue {
    public selectedPlugin: PluginModel;

    public get pluginStatusIndicator() {
        switch (this.selectedPlugin.status) {
            case PluginInstallStatus.Installed:
                return { cls: 'status-indicator amber', text: this.$t('plugin_status_installed') };
            case PluginInstallStatus.Enabled:
                return { cls: 'status-indicator green', text: this.$t('plugin_status_enabled') };
            case PluginInstallStatus.Disabled:
                return { cls: 'status-indicator red', text: this.$t('plugin_status_disabled') };
            case PluginInstallStatus.Uninstalled:
                return { cls: 'status-indicator red', text: this.$t('plugin_status_uninstalled') };
        }
    }
}
