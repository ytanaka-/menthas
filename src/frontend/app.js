import Vue from 'vue';
import VueRouter from 'vue-router'
import Vue2TouchEvents from 'vue2-touch-events'
import VueLoading from 'vue-loading-template'
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
    if (window.pageYOffset >= 65 || to.query.triger == "swipe") {
      y = 65;
    }
    return { x: 0, y: y }
  }
})

router.afterEach((to, from) => {
  if (window.gtag != undefined) {
    gtag('config', 'UA-63592648-1', {'page_path': to.path});
  }
})

Vue.use(VueRouter);
Vue.use(VueLoading);
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