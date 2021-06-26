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
// external dependencies
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mapGetters } from 'vuex';

// internal dependencies
import { PluginModel } from '@/core/database/entities/PluginModel';
import { PluginRecipeStatus } from '@/services/PluginService';

@Component({
    computed: {
        ...mapGetters({
            listedPlugins: 'plugin/listedPlugins',
            registryPlugins: 'plugin/registryPlugins',
        }),
    },
})
export class ModalPluginInstallManagerTs extends Vue {
    /**
     * Modal title
     * @type {string}
     */
    @Prop({ default: '' }) title: string;

    /**
     * Modal visibility state from parent
     * @type {string}
     */
    @Prop({ default: false }) visible: boolean;

    /**
     * The list of plugins installed on the filesystem.
     * @var {PluginModel}
     */
    protected listedPlugins: PluginModel[];

    /**
     * The list of plugins from the registry.
     * @var {PluginModel}
     */
    protected registryPlugins: PluginModel[];

    /**
     * The list of selected plugins.
     * @var {string[]}
     */
    protected selectedPlugins: string[] = [];

    /**
     * Internal visibility state
     * @type {boolean}
     */
    public get show(): boolean {
        return this.visible;
    }

    /**
     * Emits close event
     * @emits   close
     */
    public set show(val) {
        if (!val) {
            this.$emit('close');
        }
    }

    /**
     * Checks whether a plugin is installed.
     *
     * @param   {string}    npmModule 
     * @returns {boolean} 
     */
    protected isInstalled(npmModule) {
        const plugin = this.listedPlugins.find(
            p => p.npmModule === npmModule
        )

        if (! plugin) {
            return false;
        }

        return plugin.status === PluginRecipeStatus.Uploaded;
    }

    /**
     * Checks whether a plugin is selected for installation.
     *
     * @param   {string}    npmModule 
     * @returns {boolean} 
     */
    protected isSelected(npmModule) {
        return this.selectedPlugins.includes(npmModule);
    }

    /**
     * Checks whether a plugin is installed.
     *
     * @param   {string}    npmModule
     */
    protected togglePlugin(npmModule) {
        if (this.selectedPlugins.includes(npmModule)) {
            // removes selected state
            this.selectedPlugins = this.selectedPlugins.filter(
                p => p !== npmModule
            );
        }
        else {
            this.selectedPlugins.push(npmModule);
        }

        console.log("now have selectedPlugins: ", this.selectedPlugins)
    }

    /**
     * Checks or unchecks all plugins.
     */
    protected toggleAll() {
        if (this.selectedPlugins.length) {
            this.selectedPlugins = []
        }
        else {
            this.selectedPlugins = this.registryPlugins.map(p => p.npmModule)
        }
    }

    /**
     * Emits the @cancelled event.
     * 
     * @emit cancelled
     */
    protected onCancel() {
        this.show = false
        this.$emit('cancelled')
    }

    /**
     * Emits the @confirmed event with selected plugins in
     * case any is selected.
     * 
     * @emit confirmed
     */
    protected onSubmit() {
        if (this.selectedPlugins && this.selectedPlugins.length) {
            this.$emit('confirmed', this.selectedPlugins)
        }
    }
}
