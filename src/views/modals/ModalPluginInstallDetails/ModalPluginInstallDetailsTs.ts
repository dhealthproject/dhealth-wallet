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
import { PluginRecipeStatus } from '@/services/PluginService';

// child components
// @ts-ignore
import FormRow from '@/components/FormRow/FormRow.vue';
// @ts-ignore
import SpinnerDots from '@/components/SpinnerDots/SpinnerDots.vue';

@Component({
    components: { FormRow, SpinnerDots },
    computed: {
        ...mapGetters({
            currentRecipeStatus: 'plugin/currentRecipeStatus',
            currentRecipeDuration: 'plugin/currentRecipeDuration',
            currentRecipeArtifact: 'plugin/currentRecipeArtifact',
        }),
    },
})
export class ModalPluginInstallDetailsTs extends Vue {
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
     * The current install status.
     * @var {PluginRecipeStatus}
     */
    protected currentRecipeStatus: PluginRecipeStatus;

    /**
     * The current install duration.
     * @var {number}
     */
    protected currentRecipeDuration: number;

    /**
     * The current recipe artifact URL.
     * @var {string}
     */
    protected currentRecipeArtifact: string;

    /**
     * Internal visibility state
     * @type {boolean}
     */
    public get show(): boolean {
        return this.visible;
    }

    /**
     * Emits close event
     */
    public set show(val) {
        if (!val) {
            this.$emit('close');
        }
    }

    public get hasPendingInstallation(): boolean {
        return this.currentRecipeStatus === PluginRecipeStatus.Pending;
    }

    public get hasCompletedInstallation(): boolean {
        return [PluginRecipeStatus.Uploaded, PluginRecipeStatus.Building, PluginRecipeStatus.Success].includes(
            this.currentRecipeStatus,
        );
    }

    public get hasError(): boolean {
        return this.currentRecipeStatus === PluginRecipeStatus.Error;
    }

    public get hasPendingBundler(): boolean {
        return this.currentRecipeStatus === PluginRecipeStatus.Building;
    }

    public get hasCompletedBundler(): boolean {
        return this.currentRecipeStatus === PluginRecipeStatus.Success;
    }

    public get hasBundlerProcess(): boolean {
        return this.hasCompletedInstallation && (this.hasPendingBundler || this.hasCompletedBundler);
    }

    public get canCloseModal(): boolean {
        return this.hasError || this.hasCompletedBundler;
    }
}
