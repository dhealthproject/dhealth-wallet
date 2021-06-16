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
import { $pluginBus } from './events';

// enables IPC communicator between main and renderer processes
if ('electron' in window && 'ipcRenderer' in window['electron']) {
    /**
     * @event ipcMain:onPluginsResolved -> ipcRenderer:onPluginsReady
     * @description This event propagates *installed* plugins as being
     * ready to use for the renderer process.  This event is issued in
     * public/bundler.js when plugins have been successfully installed
     * using electron-plugin-manager (and underlying npm).  This event
     * forwards metadata about the installed plugins such as its entry
     * point, full installation path, NPM module name, etc.
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    A JSON-formatted list of plugins.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onPluginsResolved', (event, data) => {
        console.log(`[INFO][injecter.ts] received onPluginsResolved with ${data} from main process`);

        // forwarding onPluginsResolved as onPluginsReady on renderer process
        $pluginBus.$emit('onPluginsReady', JSON.parse(!!data && data.length ? data : '[]'));
    });

    /**
     * @event ipcRenderer:onPluginLoaded -> ipcRenderer:onPluginLoaded
     * @description This event propagates *loaded* plugins and updates
     * the information available about the content of the plugin  such
     * as components, routes, view, permissions and/or settings. It is
     * issued in public/plugins.js - which is auto-generated inside of
     * public/bundler.js' createInjecter() method - when a plugins has
     * been successfully *required* on the renderer process.
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    A JSON-formatted plugin object.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onPluginLoaded', (event, data) => {
        console.log(`[INFO][injecter.ts] received onPluginLoaded with ${data} from main process`);

        // forwarding onPluginLoaded on renderer process (updates components)
        $pluginBus.$emit('onPluginLoaded', JSON.parse(!!data && data.length ? data : '{}'));
    });
}

// adds window.PluginInjecter to inject plugins on page load
import '../plugins/plugins';
