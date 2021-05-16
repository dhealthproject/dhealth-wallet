try {
    window.TransportNodeHid = require('@ledgerhq/hw-transport-node-hid-noevents');
} catch (e) {}

try {
    const { ipcRenderer } = require("electron")
    window.electron = {
        ipcRenderer,
    }

    console.log("[DEBUG][preload.js] initialized window.electron.ipcRenderer")
} catch(e) {}
