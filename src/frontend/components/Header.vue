<template>
  <div class="header">
    <div class="header-container">
      <div class="logo">
        <a href="/">
          <div class="logo-img"/>
        </a>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Header',

  data: () => ({
  })
}
</script>

<style lang="stylus">
.header
  width 100%
  height 65px
  background #222
.header-container
  max-width 1030px
  margin 0 auto
.logo
  padding 7px
  margin-left 5px

.logo-img
  width auto
  height 50px
  background: url("../images/logo.svg") no-repeat

@media screen and (max-width: 480px)
  .header
    height 55px
  .logo-img
    height 41px

</style>