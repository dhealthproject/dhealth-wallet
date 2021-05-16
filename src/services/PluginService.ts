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
import { PluginModel } from '@/core/database/entities/PluginModel';

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

    public savePlugins(plugins: PluginModel[]) {
        this.pluginModelStorage.set(plugins);
    }

    public reset(): void {
        this.pluginModelStorage.remove();
    }
}
