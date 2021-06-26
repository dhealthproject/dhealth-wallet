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
     *
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
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    A JSON-formatted plugin object.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onPluginLoaded', (event, data) => {
        console.log(`[INFO][injecter.ts] received onPluginLoaded with ${data} from main process`);

        // forwarding onPluginLoaded on renderer process (updates components)
        $pluginBus.$emit('onPluginLoaded', JSON.parse(!!data && data.length ? data : '{}'));
    });

    /**
     * @event ipcRenderer:onPluginActionRequest -> ipcRenderer:onPluginActionRequest
     * @description This event propagates a Vuex store action request
     * and returns the execution result. The execution result will be
     * undefined in cases where permissions are not granted or  those
     * in which the Vuex store action is invalid or not identifiable.
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    A JSON-formatted arguments object.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onPluginActionRequest', (event, data) => {
        console.log(`[INFO][injecter.ts] received onPluginActionRequest with ${data} from plugin`);

        // adds a dispatch response listener
        $pluginBus.$once('onPluginActionResponse', (responseJson) => {
            console.log(`[INFO][injecter.ts] received onPluginActionResponse with ${responseJson} from store`);

            // forwarding onPluginActionResponse from $pluginBus on renderer process
            window['electron']['ipcRenderer'].send('onPluginActionResponse', responseJson);
        });

        // forwarding onPluginActionRequest on renderer process (dispatches action)
        $pluginBus.$emit('onPluginActionRequest', JSON.parse(!!data && data.length ? data : '{}'));
    });

    /**
     * @event ipcMain:onBeforeRecipeUploaded -> ipcRenderer:onBeforeRecipeUploaded
     * @description XXX
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    A JSON formatted dApp Recipe.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onBeforeRecipeUploaded', (event, data) => {
        console.log(`[INFO][injecter.ts] received onBeforeRecipeUploaded with ${data} from main process`);

        // forwarding onBeforeRecipeUploaded as onBeforeRecipeUploaded on renderer process
        $pluginBus.$emit('onBeforeRecipeUploaded', data);
    });

    /**
     * @event ipcMain:onRecipeUploaded -> ipcRenderer:onRecipeUploaded
     * @description XXX
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    The build number.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onRecipeUploaded', (event, data) => {
        console.log(`[INFO][injecter.ts] received onRecipeUploaded with ${data} from main process`);

        // forwarding onRecipeUploaded as onRecipeUploaded on renderer process
        $pluginBus.$emit('onRecipeUploaded', parseInt(data));
    });

    /**
     * @event ipcMain:onRecipeBuildUpdated -> ipcRenderer:onRecipeBuildUpdated
     * @description XXX
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    A number of elapsed milliseconds.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onRecipeBuildUpdated', (event, data) => {
        console.log(`[INFO][injecter.ts] received onRecipeBuildUpdated with ${data} from main process`);

        // forwarding onRecipeBuildUpdated as onRecipeBuildUpdated on renderer process
        $pluginBus.$emit('onRecipeBuildUpdated', parseInt(data));
    });

    /**
     * @event ipcMain:onRecipeBuildCompleted -> ipcRenderer:onRecipeBuildCompleted
     * @description This event propagates pre-install plugins as being
     * ready to use for the renderer process.  This event is issued in
     * public/bundler.js *before* the installing plugins such that the
     * developers can hook into the installation process.
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    The build artifact file name.
     * @return  {void}
     */
    window['electron']['ipcRenderer'].on('onRecipeBuildCompleted', (event, data) => {
        console.log(`[INFO][injecter.ts] received onRecipeBuildCompleted with ${data} from main process`);

        // forwarding onRecipeBuildCompleted as onRecipeBuildCompleted on renderer process
        $pluginBus.$emit('onRecipeBuildCompleted', data);
    });

    /**
     * @event ipcMain:onRecipeBuildError -> ipcRenderer:onRecipeBuildError
     * @description XXX
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    The error message.
     * @return  {void}
     */
     window['electron']['ipcRenderer'].on('onRecipeBuildError', (event, data) => {
        console.log(`[INFO][injecter.ts] received onRecipeBuildError with ${data} from main process`);

        // forwarding onRecipeBuildError as onRecipeBuildError on renderer process
        $pluginBus.$emit('onRecipeBuildError', data);
    });

    /**
     * @event ipcMain:onRecipeBuildTimeout -> ipcRenderer:onRecipeBuildTimeout
     * @description XXX
     *
     * @param   {EventEmitter}  event   The event emitter instance.
     * @param   {string}        data    The build number.
     * @return  {void}
     */
     window['electron']['ipcRenderer'].on('onRecipeBuildTimeout', (event, data) => {
        console.log(`[INFO][injecter.ts] received onRecipeBuildTimeout with ${data} from main process`);

        // forwarding onRecipeBuildTimeout as onRecipeBuildTimeout on renderer process
        $pluginBus.$emit('onRecipeBuildTimeout', data);
    });
}

// adds window.PluginInjecter to inject plugins on page load
import '../plugins/plugins';
