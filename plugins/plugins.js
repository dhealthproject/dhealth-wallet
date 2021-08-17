/**
 * This file is auto-generated using YourDLT Wallet
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
window.PluginPackages = [];

if ('registerComponents' in plugin0) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin0);

  window.PluginPackages.push({
    plugin: '@yourdlt/plugin-dummy',
    module: plugin0.default,
    path: '/Users/greg/Sources/using-blockchain/yourdlt-wallet/node_modules/@yourdlt/plugin-dummy',
    main: 'dist/YourDLTWalletPluginDummy.common.js'
  });
}

if ('registerComponents' in plugin1) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin1);

  window.PluginPackages.push({
    plugin: '@yourdlt/plugin-librarian',
    module: plugin1.default,
    path: '/Users/greg/Sources/using-blockchain/yourdlt-wallet/node_modules/@yourdlt/plugin-librarian',
    main: 'dist/YourDLTWalletPluginLibrarian.common.js'
  });
}

if ('registerComponents' in plugin2) {
  console.log('[DEBUG][plugins/plugins.js] plugin is: ', plugin2);

  window.PluginPackages.push({
    plugin: '@yourdlt/plugin-ninjazzz',
    module: plugin2.default,
    path: '/Users/greg/Sources/using-blockchain/yourdlt-wallet/node_modules/@yourdlt/plugin-ninjazzz',
    main: 'dist/YourDLTWalletPluginNinjaZZZ.common.js'
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
