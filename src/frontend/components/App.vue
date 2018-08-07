<template>
  <div class="App">
    <Header/>
    <Navigation/>
    <router-view keep-alive/>
  </div>
</template>

<script>
import Header from './Header.vue';
import Navigation from './Navigation.vue';

export default {
  name: 'App',

  components: {
    Header,
    Navigation
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
  height 100%
  width 100%

</style>
