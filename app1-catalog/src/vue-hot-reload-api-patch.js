const api = require('vue-hot-reload-api/dist/index.js');
const originalInstall = api.install;
api.install = function(Vue) {
  // Unwrap Module Federation ESM proxy if it exists
  const actualVue = (Vue && Vue.default) ? Vue.default : Vue;
  return originalInstall.call(this, actualVue);
};
module.exports = api;
