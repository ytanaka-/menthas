<template>
  <div class="app">
    <Header/>
    <Navigation/>
    <router-view keep-alive/>
    <Footer/>
  </div>
</template>

<script>
import Header from './Header.vue';
import Navigation from './Navigation.vue';
import Footer from './Footer.vue';

export default {
  name: 'App',

  components: {
    Header,
    Navigation,
    Footer
  },

  data: () => ({
  })

}
</script>

<style lang="stylus">
*
  margin 0
  padding 0

html
  height 100%
  width 100%
  font-family:-apple-system, BlinkMacSystemFont, "Noto Sans Japanese","ヒラギノ角ゴ ProN W3", Meiryo, sans-serif

body
  background-color #FFF
  font-size 100%

.app
  height 100%
  width 100%

</style>
