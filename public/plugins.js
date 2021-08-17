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
 * @description   This file defines routines to inject plugins to an Electron app.
 * --------------------------------------------------------------------------------------
 */
const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const { app, ipcMain } = require('electron')
const pluginManager = require('electron-plugin-manager')

/**
 * --------------------------------------------------------------------------------------
 * @class         AppPluginInstaller
 * @description   This class is responsible for initializing plugins and creates an
 *                injecter to register plugins in a Vue app. `electron-plugin-manager` is
 *                used internally to permit installing any NPM module.
 * --------------------------------------------------------------------------------------
 */
 class AppPluginInstaller {
  constructor(ipcMain, options) {
    // Setup filesystem paths
    this.dataPath = options.dataPath
    this.pluginsPath = path.join(__dirname, '../node_modules')
    this.pluginsConfPath = path.join(this.dataPath, 'plugins/plugins.json')
    this.injecterPath = path.join(this.dataPath, 'plugins/plugins.js')
    this.singlePlugin = 'plugin' in options ? options.plugin : undefined;

    // Evaluate filesystem and setup
    this.setupFilesystem()

    // Load plugins for registration
    this.loadPlugins().then(
      (plugins) => {
        console.log("[INFO][public/plugins.js] Installed plugins: ", plugins)
        process.exit(0)
      }
    )
  }

  setupFilesystem() {
    // Make filesystem compliant
    if (!fs.existsSync(this.pluginsConfPath)) {
      // Create empty plugins config
      fs.writeFileSync(this.pluginsConfPath, JSON.stringify({}), {mode: 0o644})
    }

    return this
  }

  async loadPlugins() {

    // Link plugin manager to main IPC event emitter
    pluginManager.manager(ipcMain);

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
        const installPath = path.join(this.pluginsPath, pluginSlug)

        // Passing a plugin name forces re-install
        // e.g.: npm run plugins:install @yourdlt/plugin-librarian
        // const isForcedInstall = !!this.singlePlugin && this.singlePlugin === pluginSlug

        // Removes plugin from filesystem
        // if (isForcedInstall && fs.existsSync(installPath)) {
        //   console.log(`[INFO][public/plugins.js] Now removing ${pluginSlug}...`)
        //   rimraf.sync(installPath)
        // }

        try {
          // Try installing the plugin (if necessary or forced)
          // if (isForcedInstall || !fs.existsSync(installPath)) {
          //   console.log(`[INFO][public/plugins.js] Now installing ${pluginSlug}...`)
          //   await this.installPlugin(pluginSlug, pluginVer)
          // }
          // else {
            //console.log(`[INFO][public/plugins.js] Already installed plugin ${pluginSlug}.`)
          // }

          // Verify that the plugin folder is compatible
          // if (! fs.readdirSync(installPath).includes('package.json')) {
          //   console.error(`[ERROR][public/plugins.js] Could not find a package.json for ${pluginSlug}`)
          //   continue // incompatibiliy should not break install process
          // }

          // Read package information
          let json = fs.readFileSync(path.join(installPath, 'package.json'))
          let pkg  = JSON.parse(json)

          // Version change in plugins.json forces upgrade
          // if (pkg && 'version' in pkg && pkg.version !== pluginVer) {
          //   console.log(`[INFO][public/plugins.js] Now updating ${pluginSlug} from ${pkg.version} to ${pluginVer}...`)
          //   rimraf.sync(installPath)
          //   await this.installPlugin(pluginSlug, pluginVer)

          //   // re-read package.json after upgrade
          //   json = fs.readFileSync(path.join(installPath, 'package.json'))
          //   pkg  = JSON.parse(json)
          // }

          // Merge loaded plugin and package information
          this.plugins.push({
            npmModule: pkg.name,
            installPath: installPath,
            name: pluginSlug,
            version: pkg.version,
            main: pkg.main,
            // data from `package.json`
            author: pkg && 'author' in pkg && typeof pkg.author === 'string' ? {name: pkg.author} : pkg.author,
            description: pkg && 'description' in pkg ? pkg.description : '',
            homepage: pkg && 'homepage' in pkg ? pkg.homepage : '',
            repository: pkg && 'repository' in pkg ? pkg.repository : '',
            dependencies: pkg && 'dependencies' in pkg ? pkg.dependencies : {},
          })
        }
        catch (e) {
          console.log(`[ERROR][public/plugins.js] Aborting installation for ${pluginSlug}@${pluginVer} located at ${installPath}.`)
          console.error(e)
          continue // incompatibiliy should not break install process
        }
      }

      this.createInjecter()
      return resolve(this.plugins)
    })
  }

  // async installPlugin(plugin, version) {
  //   // `electron-plugin-manager` uses NPM to install packages.
  //   return new Promise((resolve, reject) => {
  //     // must pass "dataPath" because underlying electron-plugin-manager
  //     // automatically suffixes the path with `plugins` in their path.js
  //     // @link https://github.com/pksunkara/electron-plugin-manager/blob/master/lib/path.js

  //     pluginManager.install(this.dataPath, plugin, version, (err, pluginPath) => {
  //       if (!! err) {
  //         console.error(`[ERROR][public/plugins.js] Error occured installing ${plugin}: ${err}`)
  //         return reject(err)
  //       }

  //       console.log(`[INFO][public/plugins.js] Installed ${plugin} at ${pluginPath}`)
  //       return resolve(pluginPath)
  //     });
  //   })
  // }

  createInjecter() {
    // Adds auto-generation notice
    let injecterSource = `/**
 * This file is auto-generated using YourDLT Wallet
 *
 * You should never modify the content of this file
 * unless you know what you are doing.
 *
 * The method AppPluginInstaller.createInjecter  is
 * responsible for generating this file.
 */\n`;

    // Adds plugins "require" calls
    this.plugins.forEach(
      (p, i) => injecterSource += `
const plugin${i} = require('${p.npmModule}');`);

    // Prepares Vue components available in plugins
    injecterSource += `
window.PluginPackages = [];
`;

    // Checks for Vue components registration function
    this.plugins.forEach(
      (p, i) => injecterSource += `
if ('registerComponents' in plugin${i}) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin${i});

  window.PluginPackages.push({
    plugin: '${p.npmModule}',
    module: plugin${i}.default,
    path: '${p.installPath}',
    main: '${p.main}'
  });
}
`);

    // Creates plugin injecter function to be used in renderer
    injecterSource += `
window.PluginInjecter = {
  install(Vue, opts) {
    window.PluginPackages.forEach(
      p => {
        console.log("[DEBUG][plugins/plugins.js] components are: ", p.module.components);

        // Registers components
        Object.keys(p.module.components).forEach(
          k => Vue.component(k, p.module.components[k])
        );

        setTimeout(() => {
          // Persists loaded plugin details
          // Component data is ignored here
          const entryPoint = p.path + '/' + p.main;
          const loadedPlugin = p.module;
          window.electron.ipcRenderer.send('onPluginLoaded', JSON.stringify({
            npmModule: p.plugin,
            entryPoint,
            installPath: p.path,
            view: loadedPlugin && 'view' in loadedPlugin ? loadedPlugin.view : '',
            routes: loadedPlugin && 'routes' in loadedPlugin ? loadedPlugin.routes : [],
            components: loadedPlugin && 'components' in loadedPlugin ? Object.keys(loadedPlugin.components) : [],
            storages: loadedPlugin && 'storages' in loadedPlugin ? loadedPlugin.storages : [],
            settings: loadedPlugin && 'settings' in loadedPlugin ? loadedPlugin.settings : [],
            permissions: loadedPlugin && 'permissions' in loadedPlugin ? loadedPlugin.permissions : [],
          }));
        }, 10000);
      }
    )
  }
}
`;

    console.log(`[INFO][public/plugins.js] Now creating injecter at ${this.injecterPath}`);

    //XXX add file hash to identify updates to injecter
    //XXX add tree hash to identify plugin updates

    // Saves plugins.js in plugins/
    fs.writeFileSync(this.injecterPath, injecterSource, {mode: 0o644});
  }
}

/**
 * --------------------------------------------------------------------------------------
 * @description   The following block is responsible for initializing the filesystem and
 *                the plugins manager.  This routine will install plugins using electron
 *                plugin manager: `electron-plugin-manager` and create an auto-generated
 *                plugins injecter file in `plugins/plugins.js` which is loaded into the
 *                Vue app using `src/injecter.ts`.
 * --------------------------------------------------------------------------------------
 */
// Reads command line arguments to find single plugin identifier
let which = undefined;
if (!!process.argv && process.argv.length === 3) {
  which = process.argv[2];
}

// Set the path of the folder where the persisted data is stored
app.setPath('userData', path.join(app.getPath('home'), '.yourdlt-wallet'))

// Prepare plugins manager
new AppPluginInstaller(ipcMain, {
  dataPath: path.join(__dirname, '../'),
  plugin: which,
})
