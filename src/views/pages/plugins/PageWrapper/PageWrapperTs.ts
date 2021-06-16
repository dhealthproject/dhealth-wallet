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
import { Component, Vue } from 'vue-property-decorator';
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
export class PageWrapperTs extends Vue {
    /**
     * The currently selected plugin.
     * @var {PluginModel}
     */
    public selectedPlugin: PluginModel;

    public get pluginComponent(): string {
        if (!this.selectedPlugin) {
            return null;
        }

        const components = this.selectedPlugin.components;
        if (!components.length) {
            return null;
        }

        // Try to display "view" component ("index page")
        if (this.selectedPlugin.view && this.selectedPlugin.view.length) {
            return this.selectedPlugin.view;
        }

        // Given no view, display *first* component
        const component = components[0];
        return component;
    }
}
