<template>
  <div class="newslist" v-touch:swipe="swipeHandler">
    <div class="news-container">
      <template v-if="top.main != null">
        <div class="main-container top-box">
          <div class="thumbnail-box">
            <a v-bind:href="top.main.url" v-on:click="sendGAClick(top.main.url, 1)" target="_blank" rel="noopener">
              <img v-bind:src="top.main.thumbnail" @error="imageLoadError"/>
            </a>
          </div>
          <div class="title">
            <a v-bind:href="top.main.url" v-on:click="sendGAClick(top.main.url, 1)" target="_blank" rel="noopener">
              <p>{{top.main.title}}</p>
            </a>
          </div>
          <div class="meta-info">
            <p class="meta-info-text">
              from: {{top.main.host_name}}, {{top.main.categoriesStr}}
            <template v-if="top.main.isInfluential == true">
              ,
              <span class="highly-influential">Highly Influential News</span>
            </template>
            <template v-if="top.main.isNew == true">
              ,
              <span class="new">New!</span>
            </template>
            </p>
          </div>
        </div>
        <div class="sub-container">
          <div class="text-box">
            <div class="title">
              <a v-bind:href="top.sub[0].url" v-on:click="sendGAClick(top.sub[0].url, 2)" target="_blank" rel="noopener">
                <p>{{top.sub[0].title}}</p>
              </a>
            </div>
            <div class="meta-info">
              <p class="meta-info-text">
                from: {{top.sub[0].host_name}}, {{top.sub[0].categoriesStr}}
              <template v-if="top.sub[0].isInfluential == true">
                ,
                <span class="highly-influential">Highly Influential News</span>
              </template>
              <template v-if="top.sub[0].isNew == true">
                ,
                <span class="new">New!</span>
              </template>
              </p>
            </div>
            <div class="description">
              <p class="description-text">{{top.sub[0].description}}</p>
            </div>
          </div>
        </div>
        <div class="sub-container">
          <div class="text-box">
            <div class="title">
              <a v-bind:href="top.sub[1].url" v-on:click="sendGAClick(top.sub[1].url, 2)" target="_blank" rel="noopener">
                <p>{{top.sub[1].title}}</p>
              </a>
            </div>
            <div class="meta-info">
              <p class="meta-info-text">
                from: {{top.sub[1].host_name}}, {{top.sub[1].categoriesStr}}
              <template v-if="top.sub[1].isInfluential == true">
                ,
                <span class="highly-influential">Highly Influential News</span>
              </template>
              <template v-if="top.sub[1].isNew == true">
                ,
                <span class="new">New!</span>
              </template>
              </p>
            </div>
            <div class="description">
              <p class="description-text">{{top.sub[1].description}}</p>
            </div>
          </div>
        </div>
      </template>
      <template v-for="(page, index) in pages">
        <div class="list-container" v-bind:class="{'gradual0': index == 0, 'gradual1': index == 1, 'gradual2': index == 2, 'gradual3': index == 3}" v-bind:key="page._id">
          <div class="thumbnail-box">
            <a v-bind:href="page.url" v-on:click="sendGAClick(page.url)" target="_blank" rel="noopener">
              <img v-bind:src="page.thumbnail" @error="listImageLoadError"/>
            </a>
          </div>
          <div class="text-box">
            <div class="title">
              <a v-bind:href="page.url" v-on:click="sendGAClick(page.url)" target="_blank" rel="noopener">
                <p>{{page.title}}</p>
              </a>
            </div>
            <div class="meta-info">
              <p class="meta-info-text">
                from: {{page.host_name}}, {{page.categoriesStr}}
              <template v-if="page.isInfluential == true">
                ,
                <span class="highly-influential">Highly Influential News</span>
              </template>
              <template v-if="page.isNew == true">
                ,
                <span class="new">New!</span>
              </template>
              </p>
            </div>
            <div class="description">
              <p class="description-text">{{page.description}}</p>
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
      if (channel) {
        this.$store.dispatch("getChannelPages", channel);
      } else {
        this.$store.dispatch("getChannelPages", "all");
      }
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
  },
  methods: {
    imageLoadError (el) {
      el.target.src = "/images/no-image.png";
    },
    listImageLoadError (el) {
      el.target.src = "/images/no-image-big.png";
    },
    swipeHandler (direction) {
      let current = 0;
      const channels = this.$store.getters.channels;
      channels.some((channel, i) => {
        if (channel.name == this.channel) {
          current = i;
          return true;
        }
      });
      // 右swipe
      if (direction == "left") {
        if (current != channels.length - 1){
          const toChannel = channels[current + 1];
          this.$router.push({ path: `/${toChannel.name}`, query: { triger: "swipe"}});
          document.getElementById(`${toChannel._id}`).scrollIntoView({inline: 'center'});
        }
      } else if (direction == "right") {
        if (current != 0){
          const toChannel = channels[current - 1];
          if (current == 1){
            // queryを付けると.router-link-activeがうまくつかないので付けないでおく
            this.$router.push({ path: "/" });
          } else {
            this.$router.push({ path: `/${toChannel.name}`, query: { triger: "swipe"}});
          }
          document.getElementById(`${toChannel._id}`).scrollIntoView({inline: 'center'});
        }
      }
    },
    sendGAClick (url, pos) {
      if(window.gtag != undefined){
        let position;
        if (pos == 1){
          position = "position_top";
        } else if(pos == 2){
          position = "position_side";
        } else {
          position = "position_list";
        }
        window.gtag('event', 'click', {
          'event_category': position,
          'event_label': url,
          'transport_type': 'beacon'
        });
      }
    }
  }
};
</script>

<style lang="stylus">
.newslist
  max-width 1100px
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
  display grid
  grid-template-columns repeat(5, 1fr)
  grid-template-rows 160px min-content auto
  justify-content space-around

.main-container
  grid-column 1 / 4
  grid-row 1 / 4
  margin-right 20px
  padding 0px 6px

.top-box
  display flex
  flex-direction column
  margin-bottom 35px
  .thumbnail-box
    a img
      object-fit cover
      width 100%
      height 260px
      clip-path polygon(0 0, 100% 0, 100% 100%, 0 98%)
      -webkit-clip-path polygon(0 0, 100% 0, 100% 100%, 0 98%)
  .title
    max-height calc(20px * 1.6 * 3)
    a
      font-size 20px
      line-height 1.6
  .meta-info
    max-height calc(12px * 1.4 * 3)

.sub-container
  grid-column 4 / 6
  min-height 130px
  margin-left 10px
  margin-bottom 15px
  .title
    max-height calc(17px * 1.4 * 3)
    margin-top 0px
    margin-bottom 3px
    a
      font-size 17px
      line-height 1.4
  .meta-info
    margin 2px 0px

.text-box
  width 100%
  max-height 149px
  overflow hidden

.title
  max-height calc(17px * 1.5 * 3)
  margin 6px 0px
  overflow hidden
  a
    font-size 17px
    line-height 1.5

.meta-info
  max-height calc(12px * 1.4 * 2)
  margin 3px 0px
  overflow hidden
  text-overflow ellipsis
  .meta-info-text
    font-size 12px
    line-height 1.4
    color #8C8C8C
  .highly-influential
    font-size 12px
    line-height 1.4
    color #dd913f
  .new
    font-size 12px
    color #ED0B0B

.description
  max-height calc(13px * 1.4 * 3)
  margin 6px 0px
  overflow hidden
  .description-text
    font-size 13px
    line-height 1.4
    color #222

.gradual0
  max-width 930px !important
.gradual1
  max-width 900px !important
.gradual2
  max-width 850px !important
.gradual3
  max-width 780px !important

.list-container
  grid-column 1 / 6
  max-width 710px
  display flex
  overflow hidden
  border-top 1px solid #e0e0e0
  padding 12px 6px

  .text-box
    flex 1

  .thumbnail-box
    width 120px
    height 90px
    margin 10px 0px
    margin-right 25px

    a img
      object-fit cover
      width 120px
      height 90px


@media screen and (max-width: 480px)
  .news-container
    grid-template-rows auto
  .main-container
    grid-column 1 / 6
    margin-right 0px

  .top-box
    .title
      max-height calc(17px * 1.4 * 3)
      a
        font-size 17px
        line-height 1.4
    .thumbnail-box
      a img
        height 150px

  .sub-container
    grid-column 1 / 6
    margin-left 0px
    padding 12px 6px
    border-top 1px solid #e0e0e0
    .title
      max-height calc(17px * 1.4 * 3)
      a
        font-size 17px
        line-height 1.4

  .list-container
    padding 10px 6px
    .thumbnail-box
      width 72px
      height 54px
      margin-right 15px
      a img
        object-fit cover
        width 72px
        height 54px
    .meta-info
      max-height calc(11px * 1.4 * 2)
      .meta-info-text
        font-size 11px
        line-height 1.4
    .highly-influential
      font-size 11px
    .new
      font-size 11px
    .text-box
      margin-bottom 6px

    .description
      max-height calc(12px * 1.4 * 3)
      .description-text
        font-size 12px
        line-height 1.4

  .title
    max-height calc(16px * 1.5 * 3)
    a
      font-size 16px
      line-height 1.5

</style>