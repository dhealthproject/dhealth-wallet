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
import { Component, Vue, Prop } from 'vue-property-decorator';
import { GenericTableDisplay, GenericTableRow } from '@dhealth/wallet-components';
import { NavigationLinks } from '@dhealth/wallet-components';

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
        GenericTableRow,
    },
})
export class PluginDetailMultiPanelTs extends Vue {
    /**
     * The active plugin.
     * @var {PluginModel}
     */
    @Prop({ default: null }) plugin: PluginModel;

    public subpageIndexes: { [k: string]: number } = {
        summary: 0,
        routes: 1,
        storages: 2,
        settings: 3,
        permissions: 4,
    };
    public selectedSubpage: number = 0;

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
        let timestamp = this.plugin.createdAt;
        if (!!this.plugin.updatedAt) {
            timestamp = this.plugin.updatedAt;
        }

        return new Date(timestamp).toLocaleString();
    }

    public get dataTimestamp(): number {
        return this.lastUpdatedData;
    }

    public get pluginRoutes(): any[] {
        return [...this.getFormattedRoutes()];
    }

    public get pluginComponents(): any[] {
        return this.plugin.components && this.plugin.components.length ? this.plugin.components.map((c) => ({ name: c })) : [];
    }

    public get pluginDependencies(): any[] {
        return this.plugin.dependencies && Object.keys(this.plugin.dependencies).length
            ? Object.keys(this.plugin.dependencies).map((d) => ({ name: d }))
            : [];
    }

    public get pluginStorages(): any[] {
        return this.plugin.storages && this.plugin.storages.length
            ? this.plugin.storages.map((s) => ({
                  storageKey: s.storageKey,
                  entries: 0, //!!datarows && 'data' in datarows ? datarows.data.length : 0,
                  description: s.description,
              }))
            : [];
    }

    public get pluginSettings(): any[] {
        let buckets = [];
        const dictionary = [];
        buckets = this.plugin.settings;
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
        return dictionary && dictionary.length ? dictionary : [];
    }

    public get pluginPermissions(): any[] {
        return this.plugin.permissions && this.plugin.permissions.length
            ? this.plugin.permissions.map((p) => ({
                  name: p.name,
                  type: p.type,
                  target: p.target,
                  description: p.description,
              }))
            : [];
    }
    /// end-region computed properties

    /// region component methods
    public async created() {
        this.lastUpdatedData = new Date().valueOf();
    }

    public handleRouteClick(name) {
        console.log('Clicked route with name: ', name);
    }

    public handleComponentClick(name) {
        console.log('Clicked component with name: ', name);
    }

    public handleDependencyClick(name) {
        console.log('Clicked dependency with name: ', name);
    }

    public handleStorageClick(storageKey) {
        console.log('Clicked storage with storageKey: ', storageKey);
    }

    public handleSettingClick(name) {
        console.log('Clicked setting with name: ', name);
    }

    public handlePermissionClick(name) {
        console.log('Clicked permission with name: ', name);
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
        if ('routes' in this.plugin && this.plugin.routes) {
            routes = this.plugin.routes;
        }

        return routes && routes.length
            ? routes.map((r) => ({
                  name: r.name,
                  path: r.path,
                  children: this.getFormattedRoutes(r),
              }))
            : [];
    }
    /// end-region protected API
}
