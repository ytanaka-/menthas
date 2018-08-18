import Vue from 'vue';
import VueRouter from 'vue-router'
import Vue2TouchEvents from 'vue2-touch-events'
import App from './components/App.vue'
import NewsList from './components/NewsList.vue'
import { store } from './stores/index'

const router = new VueRouter({
  mode: 'history',
  routes: [
    { path: '/', component: NewsList },
    { path: '/:channel', component: NewsList, props: true }
  ],
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})

Vue.use(VueRouter);
Vue.use(Vue2TouchEvents);

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  created () {
    this.$store.dispatch('getChannels', {})
  }
});