import { store } from 'quasar/wrappers';
import Vuex from 'vuex';
import auth from './auth';

export default store(function ({ Vue }) {
  Vue.use(Vuex);

  const Store = new Vuex.Store({
    modules: {
      auth
    },
    strict: !!process.env.DEBUGGING
  });

  return Store;
});
