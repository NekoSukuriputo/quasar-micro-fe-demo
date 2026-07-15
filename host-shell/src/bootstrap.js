import Vue from 'vue';
import App from './App.vue';
import Quasar, * as All from 'quasar';
import 'quasar/dist/quasar.css';

// Import Quasar icons
import '@quasar/extras/material-icons/material-icons.css';

import routerFn from './router';
import storeFn from './store';

const components = {};
const directives = {};
const plugins = {};

Object.entries(All).forEach(([key, value]) => {
  if (!value || key === 'default' || key === 'Quasar') return;

  if (typeof value === 'function' && value.options && value.options.name) {
    components[key] = value;
  } else if (typeof value === 'object' && value.unbind) {
    directives[key] = value;
  } else if (typeof value === 'object' && value.install) {
    plugins[key] = value;
  } else if (typeof value === 'object' && (value.render || value.name)) {
    components[key] = value;
  }
});

Vue.use(Quasar, {
  components,
  directives,
  plugins,
  config: {}
});

// Quasar wrappers return the factory function in .default if using ES modules
const createStore = storeFn.default || storeFn;
const createRouter = routerFn.default || routerFn;

const store = createStore({ Vue });
const router = createRouter({ Vue, store });

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#q-app');
