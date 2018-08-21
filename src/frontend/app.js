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
    let y = 0
    if (document.scrollingElement.scrollTop >= 65) {
      y = 65;
    }
    return { x: 0, y: y }
  }
})

Vue.use(VueRouter);
Vue.use(Vue2TouchEvents, { swipeTolerance: 150 });

new Vue({
  router,
  store,
  el: '#app',
  render: h => h(App),
  created () {
    this.$store.dispatch('getChannels', {})
  }
});