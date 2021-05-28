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

import { PluginModel } from '@/core/database/entities/PluginModel';
import { AppRoute } from '@/router/AppRoute';
import { PluginService } from '@/services/PluginService';

// child components
// @ts-ignore
import IconButton from '@/components/IconButton/IconButton.vue';
// @ts-ignore
import NavigationLinks from '@/components/NavigationLinks/NavigationLinks.vue';
// @ts-ignore
import GenericTableDisplay from '@/components/GenericTableDisplay/GenericTableDisplay.vue';

@Component({
    components: {
        IconButton,
        NavigationLinks,
        GenericTableDisplay,
    },
    computed: {
        ...mapGetters({
            selectedPlugin: 'plugin/currentPlugin',
        }),
    },
})
export class PluginDetailMultiPanelTs extends Vue {
    public selectedPlugin: PluginModel;
    public subpageIndexes: { [k: string]: number } = {
        summary: 0,
        routes: 1,
        storages: 2,
        settings: 3,
        permissions: 4,
    };
    public selectedSubpage: number = 0;

    public get activeSubpage() {
        return this.selectedSubpage;
    }

    public set activeSubpage(index) {
        if (index < 0 || index >= Object.keys(this.subpageIndexes).length) {
            index = 0;
        }

        this.selectedSubpage = index;
    }

    public get updatedDate(): string {
        let timestamp = this.selectedPlugin.createdAt;
        if (!!this.selectedPlugin.updatedAt) {
            timestamp = this.selectedPlugin.updatedAt;
        }

        return new Date(timestamp).toLocaleString();
    }

    public getFormattedRoutes(parent?: AppRoute | undefined): any[] {
        if (!!parent) {
            return parent.children && parent.children.length
                ? parent.children.map((c) => ({
                      name: c.name,
                      path: c.path,
                      children: this.getFormattedRoutes(c),
                  }))
                : [];
        }

        return this.selectedPlugin.routes.map((r) => ({
            name: r.name,
            path: r.path,
            children: this.getFormattedRoutes(r),
        }));
    }

    public getFormattedComponents(): any[] {
        const comps = Object.keys(this.selectedPlugin.components);
        return comps.map((c) => ({
            name: c,
        }));
    }

    public getFormattedDependencies(): any[] {
        const deps = Object.keys(this.selectedPlugin.dependencies);
        return deps.map((d) => ({
            name: d,
        }));
    }

    public getFormattedStorages(): any[] {
        return this.selectedPlugin.storages.map((s) => {
            const database = new PluginService().getStorage(s.storageKey, s.model);
            const datarows = database.get();

            return {
                storageKey: s.storageKey,
                entries: !!datarows && 'data' in datarows ? datarows.data.length : 0,
                description: s.description,
            };
        });
    }

    public getFormattedSettings(): any[] {
        const opts = Object.keys(this.selectedPlugin.settings);
        return opts.map((o) => ({
            name: o,
            value: this.selectedPlugin.settings[o],
        }));
    }

    public handleRouteClick(index) {
        console.log('Clicked route at index: ', index);
    }

    public handleComponentClick(index) {
        console.log('Clicked component at index: ', index);
    }

    public handleDependencyClick(index) {
        console.log('Clicked dependency at index: ', index);
    }

    public handleStorageClick(index) {
        console.log('Clicked storage at index: ', index);
    }

    public handleSettingClick(index) {
        console.log('Clicked setting at index: ', index);
    }

    public handlePermissionClick(index) {
        console.log('Clicked permission at index: ', index);
    }
}
