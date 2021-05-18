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
import * as _ from 'lodash';

import { PluginModelStorage } from '@/core/database/storage/PluginModelStorage';
import { PluginInstallStatus, PluginModel } from '@/core/database/entities/PluginModel';

export class PluginService {
    /**
     * The plugins information local cache.
     */
    private readonly pluginModelStorage = PluginModelStorage.INSTANCE;

    public getPlugins(): PluginModel[] {
        try {
            const allPlugins = this.pluginModelStorage.get() || [];
            return _.uniqBy(allPlugins, 'npmModule');
        } catch (e) {
            return [];
        }
    }

    public installPlugins(plugins: PluginModel[]) {
        this.pluginModelStorage.set(plugins);
    }

    public updatePlugins(plugins: PluginModel[]) {
        // read from database to identify uninstalls
        const fromStorage = this.getPlugins();
        const discovered = plugins.map((p) => p.npmModule);

        // check for manually uninstalled plugins
        let uninstalled = fromStorage.filter((p) => !discovered.includes(p.npmModule));

        // set "uninstalled" flags
        uninstalled = uninstalled.map((p) =>
            Object.assign({}, p, {
                status: PluginInstallStatus.Uninstalled,
                updatedAt: new Date().getTime(),
            }),
        );

        // update storage with newly discovered plugins
        const updated = _.uniqBy(plugins.concat(uninstalled), 'npmModule');
        console.log('Updating plugins with: ', updated);

        this.pluginModelStorage.set(updated);
    }

    public reset(): void {
        this.pluginModelStorage.remove();
    }
}
