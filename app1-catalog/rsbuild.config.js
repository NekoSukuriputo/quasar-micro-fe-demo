const { defineConfig } = require('@rsbuild/core');
const { pluginVue2 } = require('@rsbuild/plugin-vue2');

const isProd = process.env.NODE_ENV === 'production';

module.exports = defineConfig({
  plugins: [pluginVue2()],
  server: {
    port: 3001,
  },
  output: {
    assetPrefix: isProd ? '/app1-catalog/' : '/',
  },
  source: {
    define: {
      'process.env.DEBUGGING': JSON.stringify(true),
      'process.env.VUE_ROUTER_MODE': JSON.stringify('hash'),
      'process.env.VUE_ROUTER_BASE': JSON.stringify('/'),
      'process.env.DEV': JSON.stringify(true),
      'process.env.PROD': JSON.stringify(false),
      'process.env.CLIENT': JSON.stringify(true),
      'process.env.SERVER': JSON.stringify(false)
    },
    alias: {
      'vue-hot-reload-api$': './src/vue-hot-reload-api-patch.js',
      'vue$': './src/vue-proxy.js',
      'shared-vue': 'vue/dist/vue.runtime.common.js'
    }
  },
  moduleFederation: {
    options: {
      name: 'app1',
      filename: 'remoteEntry.js',
      exposes: {
        './Catalog': './src/pages/CatalogPage.vue',
      },
      shared: {
        'shared-vue': { singleton: true, eager: true },
        vuex: { singleton: true, eager: true }
      }
    }
  },
});
