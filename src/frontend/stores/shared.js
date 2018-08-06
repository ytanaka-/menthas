export default {
  state: {
    error: null
  },
  mutations: {
    setError (state, payload) {
      state.error = payload
    },
    clearError (state) {
      state.error = null
    }
  },
  actions: {
    clearError ({commit}) {
      commit('clearError')
    }
  },
  getters: {
    error (state) {
      return state.error
    }
  }
}