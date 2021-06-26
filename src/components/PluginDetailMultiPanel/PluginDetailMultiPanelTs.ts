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
import { GenericTableDisplay } from '@yourdlt/wallet-components';
import { NavigationLinks } from '@yourdlt/wallet-components';

import { PluginModel } from '@/core/database/entities/PluginModel';
import { AppRoute } from '@/router/AppRoute';

// child components
// @ts-ignore
import IconButton from '@/components/IconButton/IconButton.vue';

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

    protected pluginRoutes: any[];
    protected pluginComponents: any[];
    protected pluginDependencies: any[];
    protected pluginStorages: any[];
    protected pluginSettings: any[];
    protected pluginPermissions: any[];
    protected lastUpdatedData: number = new Date().valueOf();

    /// region computed properties
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

    public get dataTimestamp(): number {
        return this.lastUpdatedData;
    }
    /// end-region computed properties

    /// region component methods
    public async created() {
        await this.refreshData();
        this.lastUpdatedData = new Date().valueOf();
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
    /// end-region component methods

    /// region protected API
    protected getFormattedRoutes(parent?: AppRoute | undefined): any[] {
        if (!!parent) {
            return parent.children && parent.children.length
                ? parent.children.map((c) => ({
                      name: c.name,
                      path: c.path,
                      children: this.getFormattedRoutes(c),
                  }))
                : [];
        }

        // check for emptiness
        let routes = [];
        if ('routes' in this.selectedPlugin && this.selectedPlugin.routes) {
            routes = this.selectedPlugin.routes;
        }

        return routes && routes.length
            ? routes.map((r) => ({
                  name: r.name,
                  path: r.path,
                  children: this.getFormattedRoutes(r),
              }))
            : [];
    }

    protected async refreshData() {
        let components = [],
            dependencies = [],
            storages = [],
            buckets = [], // settings buckets
            settings = [],
            permissions = [];

        if ('components' in this.selectedPlugin && this.selectedPlugin.components) {
            components = this.selectedPlugin.components;
        }

        if ('dependencies' in this.selectedPlugin && this.selectedPlugin.dependencies) {
            // uses only keys ("name")
            dependencies = Object.keys(this.selectedPlugin.dependencies);
        }

        if ('storages' in this.selectedPlugin && this.selectedPlugin.storages) {
            storages = this.selectedPlugin.storages;
        }

        if ('settings' in this.selectedPlugin && this.selectedPlugin.settings) {
            // settings are sent in buckets
            const dictionary = [];
            buckets = this.selectedPlugin.settings;
            buckets.forEach((bucket) => {
                const fields = Object.keys(bucket);
                fields.forEach((f) =>
                    dictionary.push({
                        name: f,
                        value: bucket[f],
                    }),
                );
            });

            // fixes lint rule "prefer-const"
            settings = dictionary;
        }

        if ('permissions' in this.selectedPlugin && this.selectedPlugin.permissions) {
            permissions = this.selectedPlugin.permissions;
        }

        this.pluginRoutes = [...this.getFormattedRoutes()];

        this.pluginComponents = components && components.length ? components.map((c) => ({ name: c })) : [];

        this.pluginDependencies = dependencies && dependencies.length ? dependencies.map((d) => ({ name: d })) : [];

        //!!datarows && 'data' in datarows ? datarows.data.length : 0,
        this.pluginStorages =
            storages && storages.length ? storages.map((s) => ({ storageKey: s.storageKey, entries: 0, description: s.description })) : [];

        this.pluginSettings = settings && settings.length ? settings : [];

        this.pluginPermissions =
            permissions && permissions.length
                ? permissions.map((p) => ({ name: p.name, type: p.type, target: p.target, description: p.description }))
                : [];
    }
    /// end-region protected API
}
