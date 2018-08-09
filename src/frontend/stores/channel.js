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
      const channelName = payload.channelName;
      // channel更新時のためにtopを初期化
      state.top.main = null;
      state.top.sub = [];
      const selections = [];

      const pages = payload.pages
      pages.forEach((page, i) => {
        // サムネイルが設定されていない場合はここで代替
        if (!page.thumbnail) {
          page.thumbnail = "/images/no-image.png";
        }
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
          // topに入れるpage候補を探索
          // 1. 新着15件のうちscoreが対象カテゴリで4以上のものを探索
          // 2. 足りなかったら新着順に入れる
          if (score.category.name == channelName && score.score >= 4 && i < 15 && selections.length < 3) {
            selections.push(i)
          }
        })
      })

      pages.some((page, i) => {
        if (i >= 3) {
          return true
        }
        if (selections.length < 3 && !selections.includes(i)){
          selections.push(i);
        }
      })

      selections.forEach((index, i)=>{
        if (i == 0){
          state.top.main = pages[index]
        }else{
          state.top.sub.push(pages[index])
        }
      })
      const _pages = []
      pages.forEach((page, i) => {
        if (!selections.includes(i)) {
          _pages.push(page)
        }
      })
      state.pages = _pages
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
                pages: data.pages,
                channelName: channelName
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