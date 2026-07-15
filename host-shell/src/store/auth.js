export default {
  namespaced: true,
  state: () => ({
    isAuthenticated: false,
    user: null
  }),
  mutations: {
    SET_AUTH(state, payload) {
      state.isAuthenticated = payload.isAuthenticated;
      state.user = payload.user;
    }
  },
  actions: {
    login({ commit }) {
      commit('SET_AUTH', { isAuthenticated: true, user: { name: 'User MicroFE' } });
    },
    logout({ commit }) {
      commit('SET_AUTH', { isAuthenticated: false, user: null });
    }
  }
}
