<template>
  <div class="navigation">
    <div class="navigation-wrap">
      <ul class="navigation-container">
        <li class="channel-section" v-for="channel in channels" v-bind:key="channel.name" v-bind:id="channel._id">
          <template v-if="channel.name == 'all'">
            <router-link to="/" exact>
              <span class="navigation-channel-text">{{ channel.title }}</span>
            </router-link>
          </template>
          <template v-else>
            <router-link v-bind:to="channel.name">
              <span class="navigation-channel-text">{{ channel.title }}</span>
            </router-link>
          </template>
        </li>
      </ul>
    </div>
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
  border-bottom 1px solid #ccc
  position sticky
  position -webkit-sticky
  top 0
  z-index 1000
  background #FFF

.navigation-wrap
  overflow scroll
  -webkit-overflow-scrolling touch
  -ms-overflow-style none

.navigation-wrap::-webkit-scrollbar
  display none

.navigation-container
  width 100%
  height 100%
  min-width 950px
  display flex
  justify-content center
  -webkit-justify-content center
  align-items center
  -webkit-align-items center

ul
  list-style-type none

.channel-section
  margin 0 4px
  min-width 50px
  a
    display block
    height 35px
    padding 0 6px
    text-align center
    line-height 33px
    text-decoration none
    color #222
    font-size 13px
    white-space nowrap
  a:hover,a:focus
    color #17538a
  .router-link-active
    box-sizing border-box
    border-bottom 2px solid #222

@media screen and (max-width: 480px)
  .channel-section
    margin 0 5px
    a
      height 42px
      line-height 40px
    .router-link-active
      transition all 0.3s ease-out

</style>