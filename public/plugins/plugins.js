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
const plugin5 = require('@dhealthdapps/bridge');

/**
 * This method registers components and settings of
 * installed plugins and updates storage to contain
 * the correct reference to modules.
 *
 * @param   {Vue}   $app  The Vue instance.
 * @param   {any}   p     The imported NPM module.
 * @returns {void}
 */
const registerPlugin = ($app, p) => {
  console.log("[DEBUG][plugins/plugins.js] components are: ", p.module.components);

  // Registers components
  Object.keys(p.module.components).forEach(
    k => $app.component(k, p.module.components[k])
  );

  console.log("[DEBUG][plugins/plugins.js] electron: ", ('electron' in window) && ('ipcRenderer' in window['electron']));

  // Stops here with missing IPC
  if (!('electron' in window) || !('ipcRenderer' in window['electron'])) {
    return ;
  }

  console.log("[DEBUG][plugins/plugins.js] Now sending onPluginLoaded");

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
};

/**
 * This object serves as an installable Vue plugin.
 *
 * @example
 * Vue.use(window['PluginInjecter']);
 */
window.PluginInjecter = {
  install($app, opts) {

    registerPlugin($app, {
      plugin: '@yourdlt/plugin-dummy',
      module: plugin0.default,
      path: './plugins/@yourdlt/plugin-dummy',
      main: 'dist/YourDLTWalletPluginDummy.umd.min.js'
    });

    registerPlugin($app, {
      plugin: '@yourdlt/plugin-librarian',
      module: plugin1.default,
      path: './plugins/@yourdlt/plugin-librarian',
      main: 'dist/YourDLTWalletPluginLibrarian.umd.min.js'
    });

    registerPlugin($app, {
      plugin: '@yourdlt/plugin-ninjazzz',
      module: plugin2.default,
      path: './plugins/@yourdlt/plugin-ninjazzz',
      main: 'dist/YourDLTWalletPluginNinjaZZZ.umd.min.js'
    });

    registerPlugin($app, {
      plugin: '@dhealth/plugin-node-monitor',
      module: plugin3.default,
      path: './plugins/@dhealth/plugin-node-monitor',
      main: 'dist/dHealthWalletPluginNodeMonitor.umd.min.js'
    });

    registerPlugin($app, {
      plugin: '@dhealthdapps/health-to-earn',
      module: plugin4.default,
      path: './plugins/@dhealthdapps/health-to-earn',
      main: 'dist/dHealthWalletPluginHealthToEarnStrava.umd.min.js'
    });

    registerPlugin($app, {
      plugin: '@dhealthdapps/bridge',
      module: plugin5.default,
      path: './plugins/@dhealthdapps/bridge',
      main: 'dist/dHealthWalletPluginBridge.umd.min.js'
    });


  }
};
