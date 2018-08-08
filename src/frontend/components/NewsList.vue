<template>
  <div class="newslist">
    <div class="news-container">
      <template v-if="top.main != null">
      <div class="main-section">
        <div class="thumbnail-box">
          <a v-bind:href="top.main.url" target="_blank">
            <img v-bind:src="top.main.thumbnail"/>
          </a>
        </div>
        <div class="main-section-title">
          <a v-bind:href="top.main.url" target="_blank">
            <p>{{top.main.title}}</p>
          </a>
        </div>
        <div>
          <span class="host-name">from: {{top.main.host_name}}, {{top.main.categoriesStr}}</span>
          <template v-if="top.main.isInfluential == true">
          <span class="host-name">, </span>
          <span class="highly-influential">Highly Influential News</span>
          </template>
        </div>
      </div>
      <div class="main-sub-section">
        <div class="sub-box">
          <div class="main-sub-section-title">
            <a v-bind:href="top.sub[0].url" target="_blank">
              <p>{{top.sub[0].title}}</p>
            </a>
          </div>
          <div>
            <span class="host-name">from: {{top.sub[0].host_name}}, {{top.sub[0].categoriesStr}}</span>
            <template v-if="top.sub[0].isInfluential == true">
            <span class="host-name">, </span>
            <span class="highly-influential">Highly Influential News</span>
            </template>
          </div>
          <div>
            <p class="main-sub-section-description description">{{top.sub[0].description}}</p>
          </div>
        </div>
        <div class="sub-box">
          <div class="main-sub-section-title">
            <a v-bind:href="top.sub[1].url" target="_blank">
              <p>{{top.sub[1].title}}</p>
            </a>
          </div>
          <div>
            <span class="host-name">from: {{top.sub[1].host_name}}, {{top.sub[1].categoriesStr}}</span>
            <template v-if="top.sub[1].isInfluential == true">
            <span class="host-name">, </span>
            <span class="highly-influential">Highly Influential News</span>
            </template>
          </div>
          <div>
            <p class="main-sub-section-description description">{{top.sub[1].description}}</p>
          </div>
        </div>
      </div>
      </template>
      <template v-for="(page) in pages">
        <div class="page-section" v-bind:key="page._id">
          <div class="thumbnail-box">
            <a v-bind:href="page.url" target="_blank">
              <!-- onerror="this.src=''" を入れる-->
              <img v-bind:src="page.thumbnail"/>
            </a>
          </div>
          <div class="text-box">
            <div class="page-title">
              <a v-bind:href="page.url" target="_blank">
                <p>{{page.title}}</p>
              </a>
            </div>
            <div>
              <span class="host-name">from: {{page.host_name}}, {{page.categoriesStr}}</span>
              <template v-if="page.isInfluential == true">
              <span class="host-name">, </span>
              <span class="highly-influential">Highly Influential News</span>
              </template>
            </div>
            <div>
              <p class="description">{{page.description}}</p>
            </div>
          </div>
          
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "NewsList",

  props: {
    channel: String
  },

  watch: {
    channel(channel) {
      this.$store.dispatch("getChannelPages", channel);
    }
  },

  data: () => ({}),
  created() {
    const channel = this.channel;
    if (channel) {
      this.$store.dispatch("getChannelPages", channel);
    } else {
      this.$store.dispatch("getChannelPages", "all");
    }
  },
  computed: {
    pages() {
      return this.$store.getters.pages;
    },
    top() {
      return this.$store.getters.top;
    }
  }
};
</script>

<style lang="stylus">
.newslist
  max-width 950px
  margin 0 auto
  padding-top 20px

  a
    color #1C5D99
    font-weight bold
    font-size 22px
    word-wrap break-word
    text-decoration none
  a:visited
    color #6E97BE
    text-decoration: none
  a:hover, a:focus
    text-decoration underline

.news-container
  margin auto
  padding 0 10px
  display flex
  flex-wrap wrap
  justify-content space-around

.host-name
  width 100%
  font-size 12px
  color #8C8C8C
  margin-top 8px
  white-space nowrap
  overflow hidden
  text-overflow ellipsis

.highly-influential
  font-size 12px
  color #dd913f

.description
  width 100%
  font-size 13px
  line-height 1.4
  color #222
  margin-top 8px
  overflow hidden

.main-section
  width 55%
  height 340px
  margin-bottom 20px
  overflow hidden

  .thumbnail-box
    height (@height * (12 / 17))px

    a img
      object-fit cover
      width 100%
      height @height px
      clip-path polygon(0 0, 100% 0, 100% 100%, 0 95%)
      -webkit-clip-path polygon(0 0, 100% 0, 100% 100%, 0 95%)

  .main-section-title
    a
      font-size 21px
      line-height 1.6

.main-sub-section
  width 40%
  height 340px
  margin-left 20px
  margin-bottom 20px
  .sub-box
    height (@height / 2 - 10)px
    margin-bottom 20px
    overflow hidden
    .host-name
      white-space normal

.main-sub-section-title
  max-height (18 * 1.4 * 3 - 2)px
  overflow hidden

  a
    font-size 18px
    line-height 1.4 

.main-sub-section-description
  width 100%
  max-height (13 * 1.4 * 2 - 2)px
  font-size 13px
  line-height 1.4
  margin-top 8px


.page-section
  display flex
  width 100%
  min-height 90px
  overflow hidden
  border-bottom 1px solid #e0e0e0
  padding-top 12px
  padding-bottom 12px
  padding-left 6px
  padding-right 6px

  .text-box
    flex 1

  .thumbnail-box
    width 120px
    height 90px
    margin 10px 0px
    margin-right 25px

    a img
      object-fit cover
      width 100%
      height 90px

  .page-title
    margin 8px 0px
    max-height (17 * 1.5 * 3 - 2)px
    overflow hidden

    a
      font-size 17px
      line-height 1.5

  .page-category
    margin 8px 0px
    color #999
    font-weight bold
    font-size 14px

  .description
    margin 8px 0px
    font-size 13px
    line-height 1.4
    max-height (13 * 1.4 * 2 - 2)px

@media screen and (max-width: 480px)
  .main-section
    width 100%
    border-bottom 1px solid #e0e0e0
  .main-sub-section
    width 100%
    height 100%
    min-height 90px
    margin-left 0px
    margin-bottom 0px
    .sub-box
      border-bottom 1px solid #e0e0e0
  .page-section
    .thumbnail-box
      width 80px
      height 60px
      margin-right 15px
      a img
        object-fit cover
        width 100%
        height 60x

</style>