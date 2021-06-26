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
import AssetListPageWrap from '@/views/pages/assets/AssetListPageWrap/AssetListPageWrap.vue';
// @ts-ignore
import TableDisplay from '@/components/TableDisplay/TableDisplay.vue';
// @ts-ignore
import ModalConfirm from '@/views/modals/ModalConfirm/ModalConfirm.vue';
// @ts-ignore
import ModalPluginInstallManager from '@/views/modals/ModalPluginInstallManager/ModalPluginInstallManager.vue';
// @ts-ignore
import ModalPluginInstallDetails from '@/views/modals/ModalPluginInstallDetails/ModalPluginInstallDetails.vue';

@Component({
    components: {
        AssetListPageWrap,
        TableDisplay,
        ModalConfirm,
        ModalPluginInstallManager,
        ModalPluginInstallDetails,
    },
    computed: {
        ...mapGetters({
            knownPlugins: 'plugin/listedPlugins',
        }),
    },
})
export class ListTs extends Vue {
    /**
     * List of known plugins in local cache
     * @var {PluginModel[]}
     */
    protected knownPlugins: PluginModel[];

    /**
     * Whether currently displaying the confirmation modal box
     * @var {boolean}
     */
    public showConfirmInstallPluginModal: boolean = false;

    /**
     * Whether currently displaying the install manager
     * @var {boolean}
     */
    public showInstallPluginModal: boolean = false;

    /**
     * Whether currently displaying the install details modal box
     * @var {boolean}
     */
    public showInstallDetailsModal: boolean = false;

    /**
     * Displays plugin detail page on click of row.
     *
     * @param   {number}    index
     * @returns {void}
     */
    public async onRowClick(index: number) {
        if (!this.knownPlugins || index >= this.knownPlugins.length) {
            return;
        }

        // reads plugin from db
        const service = new PluginService(this.$parent); // Manager is parent
        const plugins = await service.getPlugins();
        const plugin = plugins.find((p, i) => i === index);

        console.log('SETTING CURRENT_PLUGIN: ', { ...plugin });

        // update in store then render
        await this.$store.dispatch('plugin/SET_CURRENT_PLUGIN', { ...plugin });
        this.$router.push({ name: 'plugins.info' });
    }

    /**
     * Displays a confirmation window to open the install
     * manager. In case of confirmation using the Confirm
     * button in the modal box,  a plugin install manager
     * modal box will be displayed.
     *
     * @returns {void}
     */
    public onAddPluginClick() {
        this.showConfirmInstallPluginModal = true;
    }

    public async onConfirmInstallPlugins(selectedPlugins: string[]) {
        // Leave trace in diagnostic console
        const message = `Requesting installation of ${selectedPlugins.length} plugin(s)`;
        this.$store.dispatch('diagnostic/ADD_DEBUG', message);

        // Closes installer to display process details
        this.showInstallPluginModal = false;
        this.showInstallDetailsModal = true;

        // common service instance
        const service = new PluginService(this.$parent); // Manager is parent
        await service.createRecipe(selectedPlugins);

        // update store state
        const plugins = service.getPlugins();
        await this.$store.dispatch('plugin/UPDATE_CACHE', plugins);
    }
}
