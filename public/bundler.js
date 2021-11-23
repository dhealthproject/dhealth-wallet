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
 * @package       dHealth Wallet
 * @description   This file defines routines to create a cross-platform Electron App.
 * --------------------------------------------------------------------------------------
 */
/// region global scoped variables
const path = require('path')
const fs = require('fs')
const { app, BrowserWindow, ipcMain, Menu, shell } = require('electron')
const name = app.getName()
const electronLocalshortcut = require('electron-localshortcut')
const contextMenu = require('electron-context-menu')
contextMenu({})
const axios = require('axios').default

let loadedPluginsCache = [],
    loadedPluginTimes  = {};
let lastPageReloadTime = 0;
/// end-region global scoped variables

/**
 * --------------------------------------------------------------------------------------
 * @class         AppMenu
 * @description   This class is responsible for the creation of a system menu (context).
 * --------------------------------------------------------------------------------------
 */
class AppMenu {
  constructor(name) {
    const fullScreenCmd = process.platform === 'darwin' ? 'Ctrl+Command+F' : 'CmdOrCtrl+F'
    const develToolsCmd = process.platform === 'darwin' ? 'Ctrl+Command+I' : 'CmdOrCtrl+I'

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
              AppMainWindow.webContents.openDevTools({ mode: 'detach' })
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
          { label: 'About dHealth', click: () => shell.openExternal('https://dhealth.network') },
          { label: 'About YourDLT', click: () => shell.openExternal('https://docs.yourdlt.tools/') },
          { label: 'About UBC Digital', click: () => shell.openExternal('https://ubc.digital') },
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
        contextIsolation: false, // @link https://github.com/electron/electron/blob/master/docs/tutorial/context-isolation.md
        nodeIntegration: false,
        nodeIntegrationInWorker: false,
        enableRemoteModule: false,
        preload: path.resolve(__dirname, 'preload.js'),
        devTools: true,
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

  onElectronReady(options) {
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
        autoHideMenuBar: process.platform === 'win32',
      })
    }
    // 30%-45px off from screen height for smaller screens
    // width is 100% of screen width - 100px
    else {
      height = parseInt((1080 * size.width) / 1920 + 30)
      options.windowConfig = Object.assign({}, options.windowConfig, {
        width: width - 100,
        height: height - 50,
        autoHideMenuBar: process.platform === 'win32',
      })
    }

    AppMainWindow = new BrowserWindow(options.windowConfig)

    // load as file
    if (process.platform === 'darwin') {
      AppMainWindow.loadFile(options.loadUrl)
    }
    // load as URL
    else {
      AppMainWindow.loadURL(options.loadUrl)
    }

    AppMainWindow.once('ready-to-show', () => {
      AppMainWindow.show()
    })
    AppMainWindow.on('closed', function () {
      AppMainWindow = null
    })
    AppMainWindow.on('will-resize', (event) => {
      event.preventDefault()
    })
    // AppMainWindow.webContents.on('did-finish-load', () => {
    //   lastPageReloadTime = new Date().valueOf();
    //   this.setupPlugins()
    // })

    const menu = Menu.buildFromTemplate(options.template)
    Menu.setApplicationMenu(menu)
  }

  onBrowserReady(options) {
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
  }

  create() {
    const electron_os = ['darwin', 'freebsd', 'openbsd', 'linux', 'win32'];
    if (electron_os.includes(process.platform)) {
      app.on('ready', () => this.onElectronReady(this.options))
    } else {
      app.on('ready', () => this.onBrowserReady(this.options))
      app.on('ready', function () {
        electronLocalshortcut.register('CommandOrControl+R', function () {
          AppMainWindow.reload()
        })
      })
    }
    app.on('window-all-closed', function () {
      app.quit()
    })
    app.on('web-contents-created', (e, webContents) => {
      webContents.on('new-window', (event, url) => {
        event.preventDefault()

        if (url.match(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/g)) {
          shell.openExternal(url)
        }
      })

      webContents.on('did-finish-load', () => {
        lastPageReloadTime = new Date().valueOf();
        this.setupPlugins()
      })
    })
  }
}

/**
 * --------------------------------------------------------------------------------------
 * @class         AppPluginManager
 * @description   This class is responsible for loading plugins from filesystem.
 * --------------------------------------------------------------------------------------
 */
class AppPluginManager {
  constructor(ipcMain, options) {
    // Setup filesystem paths
    this.dataPath = app.getPath('userData')
    this.pluginsPath = path.join(__dirname, 'plugins')
    this.pluginsConfPath = path.join(__dirname, `plugins${path.sep}plugins.json`)

    // no-limit in maximum event listeners
    ipcMain.setMaxListeners(0)

    // Handles loaded plugins to send components details to App
    ipcMain.removeAllListeners('onPluginLoaded');
    ipcMain.on('onPluginLoaded', (event, pluginJson) => {
      try {
        const parsed = JSON.parse(pluginJson)
        const lastPluginLoadTime = parsed.npmModule in loadedPluginTimes 
          ? loadedPluginTimes[parsed.npmModule]
          : 0

        const shouldForwardEvent = !loadedPluginsCache.includes(parsed.npmModule) || lastPluginLoadTime < lastPageReloadTime
        if (shouldForwardEvent) {
          loadedPluginsCache.push(parsed.npmModule)
          loadedPluginTimes[parsed.npmModule] = new Date().valueOf()
          AppMainWindow.webContents.send('onPluginLoaded', pluginJson)
        }
      }
      catch (e) {}
    })

    // Handles store action requests from plugins to App (2-way async communication)
    ipcMain.removeAllListeners('onPluginActionRequest');
    ipcMain.on('onPluginActionRequest', (event, specJson) => {
      //console.log(`[INFO][public/bundler.js] main forwarding onPluginActionRequest with ${specJson} from plugin to App`)

      // start in-scope listening for response (App to plugin)
      ipcMain.once('onPluginActionResponse', (event, responseJson) => {
        //console.log(`[INFO][public/bundler.js] main forwarding onPluginActionResponse with ${responseJson} from App to plugin`)
        AppMainWindow.webContents.send('onPluginActionResponse', responseJson)
      })

      // issue request from plugin to App
      AppMainWindow.webContents.send('onPluginActionRequest', specJson)
    })

    // Handles account requests from plugins to App
    ipcMain.removeAllListeners('onPluginAccountResponse');
    ipcMain.on('onPluginAccountResponse', (event, responseJson) => {
      console.log(`[INFO][public/bundler.js] main forwarding onPluginAccountResponse with ${responseJson} from App to plugin`)
      AppMainWindow.webContents.send('onPluginAccountResponse', responseJson)
    })

    // Runs the plugin bundler if necessary
    this.loadPlugins().then(
      (plugins) => {
        console.log("[INFO][public/bundler.js] Loaded plugins: ", plugins)

        // Send information about resolved plugins to App
        AppMainWindow.webContents.send('onPluginsResolved', JSON.stringify(plugins))
      }
    )
  }

  async loadPlugins() {

    // Reads the plugins.json configuration file
    const pluginsConfig = JSON.parse(fs.readFileSync(this.pluginsConfPath))
    const plugins = Object.keys(pluginsConfig)

    return new Promise(async (resolve) => {

      // Each plugin is *installed* and loaded individually
      this.plugins = []
      for (let i in plugins) {
        // Read basic plugin information
        const pluginSlug = plugins[i]
        const pluginVer  = pluginsConfig[pluginSlug]

        if (!pluginSlug || !pluginVer) {
          continue
        }

        const installPath = path.join(this.pluginsPath, pluginSlug)

        try {
          await this.loadPlugin(pluginSlug, pluginVer)
        }
        catch (e) {
          console.log(`Aborting installation for ${pluginSlug}@${pluginVer} located at ${installPath}.`)
          console.error(e)
          continue // incompatibiliy should not break install process
        }
      }

      return resolve(this.plugins)
    })
  }

  async loadPlugin(pluginSlug, pluginVer) {
    // read package manifest
    return new Promise((resolve, reject) => {
      // local install path
      const installPath = path.join(this.pluginsPath, pluginSlug)

      // try reading package.json using filesystem
      if (fs.existsSync(installPath)) {

        // check obligatory file
        if (!fs.readdirSync(installPath).includes('package.json')) {
          console.error(`Could not find a package.json for ${pluginSlug}`)
          throw new Error(`Could not find a package.json for ${pluginSlug}`)
        }

        // reads package from filesystem
        const json = fs.readFileSync(path.join(installPath, 'package.json'))
        const pkg  = JSON.parse(json)

        // merges loaded plugin and package information
        const instance = this.createInstance(installPath, pkg)
        this.plugins.push(instance)
        return resolve(instance)
      }
      // or remote using unpkg.com
      else {
        console.log(`[DEBUG][public/bundler.js] Plugin ${pluginSlug} using unpkg manifest`)

        axios
          .get(`https://unpkg.com/${pluginSlug}@${pluginVer}/package.json`)
          .then(response => {
            // parse package manifest
            const pkg = response.data;

            // merges loaded plugin and package information
            const instance = this.createInstance(installPath, pkg)
            this.plugins.push(instance)
            return resolve(instance)
          });
      }
    });
  }

  createInstance(installPath, pkg) {
    return {
      npmModule: pkg.name,
      installPath: `${installPath.replace(/(.*)(plugins([\/\\]).*)/, '.$3$2')}`, // e.g. "./plugins/@dhealthdapps/health-to-earn"
      name: pkg.name,
      version: pkg.version,
      main: pkg.main,
      // data from `package.json`
      author: pkg && 'author' in pkg && typeof pkg.author === 'string' ? {name: pkg.author} : ('name' in pkg.author ? pkg.author : { name: 'Unknown' }),
      description: pkg && 'description' in pkg ? pkg.description : 'N/A',
      homepage: pkg && 'homepage' in pkg ? pkg.homepage : '',
      repository: pkg && 'repository' in pkg ? pkg.repository : { url: 'N/A' },
      dependencies: pkg && 'dependencies' in pkg ? pkg.dependencies : {},
    }
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
app.setPath('userData', path.join(app.getPath('home'), '.dhealth-wallet'))

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
