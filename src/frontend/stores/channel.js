import APIClient from '../libs/api-client'

export default {
  state: {
    channels: [],
    pages: [],
    top: {
      main: null,
      sub: []
    }
  },
  mutations: {
    setChannels(state, payload) {
      state.channels = payload.channels
    },
    setChannelPages(state, payload) {
      const pages = payload.pages
      pages.forEach((page) => {
        const scores = page.scores
        scores.forEach((score) => {
          if (score.score >= 5) {
            page.isInfluential = true
          }
          if (score.score >= 3) {
            if (!page.categoriesStr) {
              page.categoriesStr = score.category.title
            } else {
              page.categoriesStr = page.categoriesStr + "," + score.category.title
            }
          }
        })
      })
      // channel更新時のためにtopを初期化
      state.top.main = null;
      state.top.sub = [];
      pages.some((page, i) => {
        if (i >= 3) {
          return true
        }
        if (i == 0) {
          state.top.main = page
        } else {
          state.top.sub.push(page)
        }
      })
      pages.splice(0, 3)
      state.pages = pages
    }
  },
  actions: {
    getChannels({ commit }, payload) {
      APIClient.getChannels()
        .then((result) => {
          const status = result.status;
          if (status === 200) {
            result.json().then((data) => {
              commit('setChannels', {
                channels: data.channels
              })
            }).catch((error) => {
              throw error;
            })
          } else {
            throw new Error(`[ServerError] StatusCode:${status}`)
          }
        }).catch((error) => {
          commit('setError', error)
        })
    },

    getChannelPages({ commit }, channelName) {
      APIClient.getChannel(channelName)
        .then((result) => {
          const status = result.status;
          if (status === 200) {
            result.json().then((data) => {
              commit('setChannelPages', {
                pages: data.pages
              })
            }).catch((error) => {
              throw error;
            })
          } else {
            throw new Error(`[ServerError] StatusCode:${status}`)
          }
        }).catch((error) => {
          commit('setError', error)
        })
    }
  },
  getters: {
    channels(state) {
      return state.channels
    },
    pages(state) {
      return state.pages
    },
    top(state) {
      return state.top
    }
  }
}