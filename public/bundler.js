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
 */
/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-var-requires */

/**
 * --------------------------------------------------------------------------------------
 * @package       YourDLT Wallet
 * @description   This file defines routines to create a cross-platform Electron App.
 * --------------------------------------------------------------------------------------
 */

const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, Menu, shell, contextBridge } = require('electron')
const name = app.getName()
const electronLocalshortcut = require('electron-localshortcut')
const contextMenu = require('electron-context-menu')
const pluginManager = require('electron-plugin-manager')
contextMenu({});

/**
 * --------------------------------------------------------------------------------------
 * @class         AppMenu
 * @description   This class is responsible for the creation of a system menu (context).
 * --------------------------------------------------------------------------------------
 */
class AppMenu {
  constructor(name) {
    const fullScreenCmd = process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11'
    const develToolsCmd = process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I'

    this.name = name
    this.template = [
      {
        label: 'Window',
        role: 'window',
        submenu: [
          { label: 'Minimize', accelerator: 'CmdOrCtrl+M', role: 'minimize', },
          { label: 'Close', accelerator: 'CmdOrCtrl+W', role: 'close', },
          { label: 'Toggle Full Screen', accelerator: fullScreenCmd, click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen())
            }
          }},
          { label: 'Toggle Developer Tools', accelerator: develToolsCmd, click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.toggleDevTools()
            }
          }},
        ],
      },
      {
        label: 'Edit',
        role: 'edit',
        submenu: [
          { label: 'Cut', accelerator: 'CmdOrCtrl+X', role: 'cut', },
          { label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy', },
          { label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste', },
          { label: 'Select All', accelerator: 'CmdOrCtrl+A', role: 'selectAll', },
        ],
      },
      {
        label: 'Help',
        role: 'help',
        submenu: [
          { label: 'Learn More', click: () => shell.openExternal('https://github.com/UsingBlockchain/yourdlt-wallet') },
          { label: 'About YourDLT', click: () => shell.openExternal('https://docs.yourdlt.tools/') },
          { label: 'About UBC Digital', click: () => shell.openExternal('https://ubc.digital') },
          { label: 'About Using Blockchain Ltd', click: () => shell.openExternal('https://using-blockchain.org') },
        ],
      },
    ]
  }

  addMacItems() {
    this.template.unshift({
      label: this.name,
      submenu: [
        { label: `About ${this.name}`, role: 'about', },
        { type: 'separator', },
        { label: 'Services', role: 'services', submenu: [], },
        { type: 'separator', },
        { label: `Hide ${this.name}`, accelerator: 'Command+H', role: 'hide', },
        { label: 'Hide others', accelerator: 'Command+Alt+H', role: 'hideothers', },
        { label: 'Show', role: 'unhide', },
        { type: 'separator', },
        { label: 'Quit', accelerator: 'Command+Q', click: () => app.quit() },
      ],
    })
  }
}

let AppMainWindow = null

/**
 * --------------------------------------------------------------------------------------
 * @class         AppWindow
 * @description   This class is responsible for initializing basic window commands and
 *                the electron IPC event handlers as well as for resizing the window.
 * --------------------------------------------------------------------------------------
 */
class AppWindow {
  constructor(ipcMain, options) {
    this.ipcMain = ipcMain
    this.options = options

    // initial window setup
    this.options.windowConfig = {
      webPreferences: {
        contextIsolation: true, // @link https://github.com/electron/electron/blob/master/docs/tutorial/context-isolation.md
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        enableRemoteModule: false,
        preload: path.resolve(__dirname, 'preload.js')
      },
      resizable: true,
    }
  }

  setupForMacOS() {
    this.ipcMain.on('app', (event, arg) => {
      switch (arg) {
        case 'quit': return AppMainWindow.close()
        case 'max':
          if (AppMainWindow.isMaximized()) {
            return AppMainWindow.restore()
          }

          return AppMainWindow.maximize()
        case 'min': return AppMainWindow.minimize()
      }
    })
  }

  setupUniversal() {
    const gotTheLock = app.requestSingleInstanceLock()

    if (!gotTheLock) {
      return app.quit()
    }

    // Disallow multiple instances
    app.on('second-instance', () => {
      if (AppMainWindow) {
        if (AppMainWindow.isMinimized()) AppMainWindow.restore()
        AppMainWindow.focus()
      }
    })

    app.on('ready', () => {
      /** This function body is needed */
    })

    this.ipcMain.on('app', (event, arg) => {
      switch (arg) {
        case 'quit': return AppMainWindow.close()
        case 'max': return AppMainWindow.maximize()
        case 'unMaximize': return AppMainWindow.unmaximize()
        case 'min': return AppMainWindow.minimize()
        default: return AppMainWindow.unmaximize()
      }
    })
  }

  setupPlugins() {
    // Load plugins/extensions
    this.manager = new AppPluginManager(ipcMain, {})
  }

  onMacReady(options) {
    // re-require electron because "screen" cannot be used before "ready"
    const size = require('electron').screen.getPrimaryDisplay().workAreaSize
    const width = parseInt(size.width)
    let height = width * 0.45

    // 30% off from screen width for big screens
    // height is 45% of screen width
    if (width >= 1920) {
      options.windowConfig = Object.assign({}, options.windowConfig, {
        width: width - (width * 0.3),
        height: width * 0.45,
        autoHideMenuBar: false,
      })
    }
    // 30%-45px off from screen height for smaller screens
    // width is 100% of screen width - 100px
    else {
      height = parseInt((1080 * size.width) / 1920 + 30)
      options.windowConfig = Object.assign({}, options.windowConfig, {
        width: width - 100,
        height: height - 50,
        autoHideMenuBar: false,
      })
    }

    AppMainWindow = new BrowserWindow(options.windowConfig)
    AppMainWindow.loadFile(options.loadUrl)
    AppMainWindow.on('closed', function () {
      AppMainWindow = null
    })

    const menu = Menu.buildFromTemplate(options.template)
    Menu.setApplicationMenu(menu)

    this.setupPlugins()
  }

  onUniversalReady(options) {
    // re-require electron because "screen" cannot be used before "ready"
    const size = require('electron').screen.getPrimaryDisplay().workAreaSize
    let width = size.width

    // width is 50% of screen width
    if (width > 1080) {
      width = parseInt(width * 0.5)
    }

    // height is 45% of screen width
    const height = parseInt(width / (1920 / 1080))

    options.windowConfig = Object.assign({}, options.windowConfig, {
      minWidth: width,
      minHeight: height,
      width: width,
      height: height,
      title: app.getName(),
      titleBarStyle: 'hiddenInset',
      icon: options.iconUrl,
    })

    AppMainWindow = new BrowserWindow(options.windowConfig)
    AppMainWindow.setMenu(null)
    AppMainWindow.loadURL(options.loadUrl)

    AppMainWindow.once('ready-to-show', () => {
      AppMainWindow.show()
    })
    AppMainWindow.on('closed', () => {
      AppMainWindow = null
    })
    AppMainWindow.on('will-resize', (event) => {
      event.preventDefault()
    })

    this.setupPlugins()
  }

  create() {
    if (process.platform === 'darwin') {
      app.on('ready', () => this.onMacReady(this.options))
    } else {
      app.on('ready', () => this.onUniversalReady(this.options))
      app.on('ready', function () {
        electronLocalshortcut.register('CommandOrControl+R', function () {
          AppMainWindow.reload();
        })
      })
    }
    app.on('window-all-closed', function () {
      app.quit()
    })
    app.on('web-contents-created', (e, webContents) => {
      webContents.on('new-window', (event, url) => {
        event.preventDefault();

        if (url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g)) {
          shell.openExternal(url)
        }
      })
    })
  }
}

/**
 * --------------------------------------------------------------------------------------
 * @class         AppPluginManager
 * @description   This class is responsible for initializing installed plugins and the
 *                underlying plugin manager by reading the subfolders of `plugin/`.
 * --------------------------------------------------------------------------------------
 */
class AppPluginManager {
  constructor(ipcMain, options) {
    // Setup filesystem paths
    this.dataPath = app.getPath('userData')
    this.pluginsPath = path.join(app.getPath('userData'), 'plugins')
    this.pluginsConfPath = path.join(this.pluginsPath, 'plugins.json')

    // Evaluate filesystem and setup
    this.setupFilesystem()

    // Load plugins for registration
    this.loadInstalledPlugins()
    console.log("YourDLT plugins resolved: ", this.plugins)

    // Send information about loaded plugins to App
    //AppMainWindow.webContents.send('toMain', JSON.stringify(this.plugins))
    AppMainWindow.webContents.send('onPluginsResolved', JSON.stringify(this.plugins))
  }

  setupFilesystem() {
    // Make filesystem compliant
    if (!fs.existsSync(this.pluginsPath)) {
      // Create empty plugins folder
      fs.mkdirSync(this.pluginsPath, 0o775)
    }
    else if (!fs.existsSync(this.pluginsConfPath)) {
      // Create empty plugins config
      fs.writeFileSync(this.pluginsConfPath, JSON.stringify({}), {mode: 0o644})
    }

    return this
  }

  loadInstalledPlugins() {

    // Discover all plugin subfolders
    const plugins = fs.readdirSync(this.pluginsPath, { withFileTypes: true })
      .filter(socket => socket.isDirectory())
      .map(folder => folder.name)

    // Link plugin manager to main IPC event emitter
    pluginManager.manager(ipcMain);

    // Load installable plugins
    this.plugins = []
    plugins.forEach((pluginSlug, i) => {
      const pluginPath = path.join(this.pluginsPath, pluginSlug)

      // Verify that the plugin folder is compatible
      if (! fs.readdirSync(pluginPath).includes('package.json')) {
        return ;
      }

      // Load the plugin's package.json
      try {
        const json = fs.readFileSync(path.join(pluginPath, 'package.json'))
        const pkg  = JSON.parse(json)
        const v = pkg.version ?? '0.0.1-alpha'
        console.log("Now loading: ", pluginSlug, '@'+v)

        // must pass "dataPath" because underlying electron-plugin-manager
        // automatically suffixes the path with `plugins` in their path.js
        // @link https://github.com/pksunkara/electron-plugin-manager/blob/master/lib/path.js
        pluginManager.load(this.dataPath, pluginSlug)

        this.plugins.push({
          npmModule: pkg.name,
          name: pluginSlug,
          version: v,
          path: pluginPath,
        })
      }
      catch (e) {
        console.log("Aborting plugin installation. Error encountered while parsing of a package.json for the plugin located at: " + pluginPath)
        console.error(e)
      }
    })

    return this
  }
}

/**
 * --------------------------------------------------------------------------------------
 * @description   The following block is responsible for initializing the system menu and
 *                application window, as well as for identifying resource files that will
 *                be bundled with the resulting application.
 * --------------------------------------------------------------------------------------
 */

// Set the path of the folder where the persisted data is stored
app.setPath('userData', path.join(app.getPath('home'), '.yourdlt-wallet'))

// Load platform specific resources
const iconUrlPath = process.platform === 'darwin' ? './dist/assets/logo.png' : `file://${__dirname}/../dist/assets/logo.png`
const loadUrlPath = process.platform === 'darwin' ? './dist/index.html' : `file://${__dirname}/../dist/index.html`

// Prepare system menu
const appMenuTemplate = new AppMenu(name)
if (process.platform === 'darwin') appMenuTemplate.addMacItems()

// Prepare main window
const appWindow = new AppWindow(ipcMain, {
  iconUrl: iconUrlPath,
  loadUrl: loadUrlPath,
  template: appMenuTemplate.template
})

// Mac OS Basic Window Commands
if (process.platform === 'darwin') {
  appWindow.setupForMacOS()
}
// OR Universal Basic Window Commands
else {
  appWindow.setupUniversal()
}

// onDOMContentLoaded directive
appWindow.create()
