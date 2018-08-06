<template>
  <div class="navigation">
    <ul class="navigation-container">
      <li class="channel-section" v-for="channel in channels" v-bind:key="channel.name">
        <router-link v-bind:to="channel.name">
          <span class="navigation-channel-text">{{ channel.title }}</span>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Navigation",

  data: () => ({
  }),

  computed: {
    channels () {
      return this.$store.getters.channels
    }
  }
}
</script>

<style lang="stylus">
.navigation
  width 100%
  height 33px
  line-height 24px
  border-bottom 1px solid #ccc
  overflow scroll
  position sticky
  position -webkit-sticky
  top 0
  z-index 1000
  background #FFF

.navigation-container
  width 100%
  height 100%
  display flex
  justify-content center
  -webkit-justify-content center
  align-items center
  -webkit-align-items center

ul
  list-style-type none

.channel-section
  margin-right 21px
  a
    text-decoration none
    color #222
    font-size 13px
    white-space nowrap
  a:hover,a:focus
    color #1C5D99
    text-decoration underline

</style>