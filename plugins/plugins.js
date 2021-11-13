/**
 * This file is auto-generated using dHealth Wallet
 *
 * You should never modify the content of this file
 * unless you know what you are doing.
 *
 * The method AppPluginInstaller.createInjecter  is
 * responsible for generating this file.
 */

const plugin0 = require('@yourdlt/plugin-dummy');
const plugin1 = require('@yourdlt/plugin-librarian');
const plugin2 = require('@yourdlt/plugin-ninjazzz');
const plugin3 = require('@dhealth/plugin-node-monitor');
const plugin4 = require('@dhealthdapps/health-to-earn');
window.PluginPackages = [];

if ('registerComponents' in plugin0) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin0);

  window.PluginPackages.push({
    plugin: '@yourdlt/plugin-dummy',
    module: plugin0.default,
    path: './node_modules/@yourdlt/plugin-dummy',
    main: 'dist/YourDLTWalletPluginDummy.common.js'
  });
}

if ('registerComponents' in plugin1) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin1);

  window.PluginPackages.push({
    plugin: '@yourdlt/plugin-librarian',
    module: plugin1.default,
    path: './node_modules/@yourdlt/plugin-librarian',
    main: 'dist/YourDLTWalletPluginLibrarian.common.js'
  });
}

if ('registerComponents' in plugin2) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin2);

  window.PluginPackages.push({
    plugin: '@yourdlt/plugin-ninjazzz',
    module: plugin2.default,
    path: './node_modules/@yourdlt/plugin-ninjazzz',
    main: 'dist/YourDLTWalletPluginNinjaZZZ.common.js'
  });
}

if ('registerComponents' in plugin3) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin3);

  window.PluginPackages.push({
    plugin: '@dhealth/plugin-node-monitor',
    module: plugin3.default,
    path: './node_modules/@dhealth/plugin-node-monitor',
    main: 'dist/dHealthWalletPluginNodeMonitor.common.js'
  });
}

if ('registerComponents' in plugin4) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin4);

  window.PluginPackages.push({
    plugin: '@dhealthdapps/health-to-earn',
    module: plugin4.default,
    path: './node_modules/@dhealthdapps/health-to-earn',
    main: 'dist/dHealthWalletPluginHealthToEarnStrava.common.js'
  });
}

window.PluginInjecter = {
  install(Vue, opts) {
    window.PluginPackages.forEach(
      p => {
        console.log("[DEBUG][plugins/plugins.js] components are: ", p.module.components);

        // Registers components
        Object.keys(p.module.components).forEach(
          k => Vue.component(k, p.module.components[k])
        );

        // Stops here with missing IPC
        if (!('electron' in window) || !('ipcRenderer' in window['electron'])) {
          return ;
        }

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
      }
    )
  }
}
