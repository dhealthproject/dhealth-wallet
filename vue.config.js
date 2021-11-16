/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable prettier/prettier */

const webpack = require('webpack');

const packageVersion = JSON.stringify(require('./package.json').version);
const web = process.env.WEB || false;

console.log(`Building package ${packageVersion} for Web: ${web}`);

const os = require('os')
const path = require('path')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = {
  // base url
  publicPath: process.env.NODE_ENV === 'production'
      ? './'
      : '/',
  // output dir
  outputDir: './dist',
  assetsDir: 'static',

  // eslint-loader check
  lintOnSave: false,

  // webpack plugins
  chainWebpack: (config) => {
    // defines network and keys
    config.plugin('define').tap((args) => {
      const env = args[0]['process.env'];
      let keys;
      try {
        keys = require('./keys-whitelist.json');
      } catch {
        keys = {
          mainnet: [],
          testnet: []
        }
      }
      args[0]['process.env'] = {
          ...env,
          PACKAGE_VERSION: packageVersion,
          WEB: web,
          KEYS_WHITELIST: JSON.stringify(keys)
      };
      return args;
    });

    // increases memory limit
    config.plugin('fork-ts-checker').tap(args => {
      let totalMem = Math.floor(os.totalmem() / 1024 / 1024);
      let allowUseMem = totalMem > 4096 ? 4096 : 1000;

      args[0].memoryLimit = allowUseMem;
      return args
    })
  },

  // webpack configuration
  configureWebpack: {
    optimization: {
      // disable module splitting
      splitChunks: false,
    },
    resolve: {
      symlinks: false,
    },
  },

  // generate map
  productionSourceMap: true,
  // use template in vue
  runtimeCompiler: true,
  // css
  css: {
    // ExtractTextPlugin
    extract: false,
    //  CSS source maps?
    sourceMap: true,
    // css loader
    loaderOptions: {
      postcss: {
        config: {
          path: './postcss.config.js'
        }
      }
    },
    // CSS modules for all css / pre-processor files.
    requireModuleExtension: true
  },
  // use thread-loader for babel & TS in production build
  // enabled by default if the machine has more than 1 cores
  parallel: require('os').cpus().length > 1,
  // webpack-dev-server
  devServer: {
    host: '0.0.0.0',
    port: 8080,
    before: app => {
    },
    proxy: {
      '/nemflash': {
        target: 'https://dhealth.network/feed/',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/nemflash': '' }
      }
    }
  },
  // plugins
  pluginOptions: {
    "process.env": {
      NODE_ENV: '"development"',
    }
  }
}
