import Vue from 'vue'
import Vuex from 'vuex'
import channel from './channel'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    channel: channel,
    shared: shared
  }
})