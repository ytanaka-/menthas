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
  max-width 950px
  margin 0 auto
.logo
  padding 7px 5px 5px 7px

.logo-img
  width auto
  height 51px
  background: url("../images/logo.svg") no-repeat

</style>