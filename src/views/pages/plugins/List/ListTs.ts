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

@Component({
    components: {
        AssetListPageWrap,
        TableDisplay,
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
}
