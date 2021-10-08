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

@Component({
    computed: {
        ...mapGetters({
            selectedPlugin: 'plugin/currentPlugin',
        }),
    },
})
export class ModalPluginStatusChangeTs extends Vue {
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
     * Plugin status (changing to ..)
     * @type {string}
     */
    @Prop({ default: '' }) status: string;

    /**
     * The currently selected plugin.
     * @var {PluginModel}
     */
    private selectedPlugin: PluginModel;

    /**
     * Whether currently performing an update or not.
     * @var {boolean}
     */
    private performingUpdate: boolean = false;

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

    public async confirm() {
        if (this.performingUpdate) {
            return;
        }

        this.performingUpdate = true;

        return await new Promise((resolve) => {
            this.$emit('confirmed', this.status);
            this.closeModal();
            return resolve(true);
        }).finally(() => (this.performingUpdate = false));
    }

    public cancel() {
        this.$emit('cancelled');
        this.closeModal();
    }

    private closeModal() {
        this.show = false;
    }
}
