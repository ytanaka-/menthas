<template>
  <div v-show="pages.length > 0" class="footer">
    <div class="footer-container">
      <div class="info1">
        <span>Menthas関連リンク: 仕組み(準備中), <a href="https://twitter.com/_ytanaka_">開発者Twitter</a>, <a href="https://github.com/ytanaka-/menthas">Github</a></span>
      </div>
      <div class="info2">
        <span>Menthasはユーザビリティの改善や分析のためGoogleAnalyticsを使用しています</span>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Footer',

  data: () => ({
  }),
  computed: {
    pages() {
      return this.$store.getters.pages;
    }
  }
}
</script>

<style lang="stylus">
.footer
  width 100%
  height 60px

.footer-container
  max-width 930px
  margin 0 auto
  padding 12px
  border-top 1px solid #e0e0e0
  font-size 12px
  color #8C8C8C
  text-align: center

  .info2
    margin-top 7px

</style>