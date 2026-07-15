const { defineConfig } = require('@rsbuild/core');
const { pluginVue2 } = require('@rsbuild/plugin-vue2');

const isProd = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
  plugins: [pluginVue2()],
  server: {
    port: 3000,
  },
  source: {
    define: {
      'process.env.DEBUGGING': JSON.stringify(!isProd),
      'process.env.VUE_ROUTER_MODE': JSON.stringify('hash'),
      'process.env.VUE_ROUTER_BASE': JSON.stringify('/'),
      'process.env.DEV': JSON.stringify(!isProd),
      'process.env.PROD': JSON.stringify(isProd),
      'process.env.CLIENT': JSON.stringify(true),
      'process.env.SERVER': JSON.stringify(false)
    },
    entry: {
      index: './src/main.js'
    },
    alias: {
      'vue-hot-reload-api$': './src/vue-hot-reload-api-patch.js',
      'vue$': './src/vue-proxy.js',
      'shared-vue': 'vue/dist/vue.runtime.common.js'
    }
  },
  html: {
    template: './src/index.template.html',
  },
  moduleFederation: {
    options: {
      name: 'host',
      remotes: {
        app1: isProd ? 'app1@/app1-catalog/remoteEntry.js' : 'app1@http://localhost:3001/remoteEntry.js',
        app2: isProd ? 'app2@/app2-cart/remoteEntry.js' : 'app2@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        'shared-vue': { singleton: true, eager: true },
        vuex: { singleton: true, eager: true }
      }
    }
  },
});
