import APIClient from '../libs/api-client'
import moment from 'moment'

export default {
  state: {
    channels: [],
    pages: [],
    top: {
      main: null,
      sub: [],
      sections: []
    }
  },
  mutations: {
    setChannels(state, payload) {
      state.channels = payload.channels
    },
    setChannelPages(state, payload) {
      const channelName = payload.channelName
      // channel更新時のためにtopを初期化
      state.top.main = null
      state.top.sub = []
      state.top.sections = []
      const selections = []
      const now = moment()
      const pages = payload.pages
      pages.forEach((page, i) => {
        const curatedTime = moment(page.curated_at)
        const diff = now.diff(curatedTime, 'hours')
        if(diff < 6){
          page.isNew = true
        }
        const scores = page.scores
        scores.forEach((score) => {
          if (score.score > 6) {
            page.isInfluential = true
          }
          if (score.score >= 3) {
            if (!page.categoriesStr) {
              page.categoriesStr = score.category.title
            } else {
              page.categoriesStr = page.categoriesStr + ", " + score.category.title
            }
          }
        })
      })

      // 上位7つをtop領域に割り当てるための処理
      pages.some((page, i) => {
        if (i >= 7) {
          return true
        }
        selections.push(i);
      })
      selections.forEach((index, i)=>{
        // サムネイルが設定されていない場合はここで代替
        if (!pages[index].thumbnail) {
          pages[index].thumbnail = "/images/no-image.png";
        }
        if (i == 0){
          state.top.main = pages[index]
        } else if (i < 3){
          state.top.sub.push(pages[index])
        } else {
          state.top.sections.push(pages[index])
        }
      })
      
      const _pages = []
      pages.forEach((page, i) => {
        if (!selections.includes(i)) {
          if (!page.thumbnail) {
            page.thumbnail = "/images/no-image-big.png";
          }
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