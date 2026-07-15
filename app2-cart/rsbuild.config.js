import { defineConfig } from '@rsbuild/core';
import { pluginVue } from '@rsbuild/plugin-vue';

const isProd = process.env.NODE_ENV === 'production';

export default defineConfig({
  plugins: [pluginVue()],
  server: {
    port: 3002,
  },
  output: {
    assetPrefix: isProd ? '/app2-cart/' : '/',
  },
  source: {
    define: {
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env.DEBUGGING': JSON.stringify(true),
      'process.env.DEV': JSON.stringify(true),
      'process.env.PROD': JSON.stringify(false)
    }
  },
  moduleFederation: {
    options: {
      name: 'app2',
      filename: 'remoteEntry.js',
      exposes: {
        './CartMount': './src/bootstrap.js',
      },
      shared: ['vue', 'pinia']
    },
  },
});
