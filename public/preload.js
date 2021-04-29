try {
    window.TransportNodeHid = require('@ledgerhq/hw-transport-node-hid-noevents');
} catch (e) {}

try {
    const { contextBridge, ipcRenderer } = require('electron');
    //const { ipcRenderer } = require("electron")

    console.log("[DEBUG][preload.js] initializing window.ipcRenderer")
    // window.electron = {
    //     ipcRenderer,
    // }

    // Expose protected methods that allow the renderer process to use
    // the ipcRenderer without exposing the entire object
    contextBridge.exposeInMainWorld('ipcRenderer', {
        send: (channel, data) => {
            console.log('[DEBUG][preload.js] sending on ' + channel + ' with data: ' + data)
            // whitelist channels
            let validChannels = ['onPluginsResolved']
            if (validChannels.includes(channel)) {
                ipcRenderer.send(channel, data)
            }
        },
        receive: (channel, func) => {
            console.log('[DEBUG][preload.js] listening to ' + channel)
            let validChannels = ['onPluginsResolved']
            if (validChannels.includes(channel)) {
                // Deliberately strip event as it includes `sender`
                ipcRenderer.on(channel, (event, ...args) => func(...args))
            }
        }
    })
} catch(e) {}
