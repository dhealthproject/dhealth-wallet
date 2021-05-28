/*
 * Copyright 2020 NEM (https://nem.io)
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

// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
import { PluginService } from '@/services/PluginService';
import { PluginModel } from '@/core/database/entities/PluginModel';

// child components
// @ts-ignore
import NavigationTabs from '@/components/NavigationTabs/NavigationTabs.vue';
// @ts-ignore
import PluginDetailMultiPanel from '@/components/PluginDetailMultiPanel/PluginDetailMultiPanel.vue';
// @ts-ignore
import PluginStatusPanel from '@/components/PluginStatusPanel/PluginStatusPanel.vue';
// @ts-ignore
import PluginInformationSidebar from '@/components/PluginInformationSidebar/PluginInformationSidebar.vue';
// @ts-ignore
import ModalConfirm from '@/views/modals/ModalConfirm/ModalConfirm.vue';
// @ts-ignore
import ModalPluginStatusChange from '@/views/modals/ModalPluginStatusChange/ModalPluginStatusChange.vue';

@Component({
    components: {
        NavigationTabs,
        PluginDetailMultiPanel,
        PluginStatusPanel,
        PluginInformationSidebar,
        ModalConfirm,
        ModalPluginStatusChange,
    },
    computed: {
        ...mapGetters({
            selectedPlugin: 'plugin/currentPlugin',
        }),
    },
})
export class InfoTs extends Vue {
    /**
     * The currently selected plugin.
     * @var {PluginModel}
     */
    public selectedPlugin: PluginModel;

    /**
     * Show confirm open modal box
     */
    public showConfirmOpenPluginStatusChangeModal: boolean = false;

    /**
     * Whether currently displaying the modal box
     * @var {boolean}
     */
    public showPluginStatusChangeModal: boolean = false;

    /**
     * The plugin status change that will happen.
     * @var {string}
     */
    public nextPluginStatus: string;

    public openReadme() {
        window.open(this.selectedPlugin.repository.replace(/\.git$/, '#readme'));
    }

    public requestEnablePlugin() {
        this.nextPluginStatus = 'enabled';
        this.showConfirmOpenPluginStatusChangeModal = true;
    }

    public requestDisablePlugin() {
        this.nextPluginStatus = 'disabled';
        this.showConfirmOpenPluginStatusChangeModal = true;
    }

    public async confirmStatusChange() {
        // Leave trace in diagnostic console
        const message = `Changing status of plugin ${this.selectedPlugin.name} to ${this.nextPluginStatus}`;
        this.$store.dispatch('diagnostic/ADD_DEBUG', message);

        // common service instance
        const service = new PluginService(this.$parent); // Manager is parent
        if (this.nextPluginStatus === 'disabled') {
            await service.disablePlugin(this.selectedPlugin.npmModule);
        } else {
            // update DB cache
            await service.enablePlugin(this.selectedPlugin.npmModule);
            console.log('routes: ', this.selectedPlugin.routes);
        }

        // update store state
        const plugins = service.getPlugins();
        await this.$store.dispatch('plugin/UPDATE_CACHE', plugins);
        await this.$store.dispatch(
            'plugin/SET_CURRENT_PLUGIN',
            plugins.find((p) => p.npmModule === this.selectedPlugin.npmModule),
        );

        // update component/page state
        this.nextPluginStatus = this.nextPluginStatus === 'enabled' ? 'disabled' : 'enabled';
        this.showPluginStatusChangeModal = false;

        // determine if we need a redirect
        console.log('status: ', this.selectedPlugin.status);
        if (this.selectedPlugin.status === 'enabled' && this.selectedPlugin.routes.length) {
            console.log('redirect to: ', this.selectedPlugin.routes[0].name);
            this.$router.push({ name: this.selectedPlugin.routes[0].name });
        }
    }
}
