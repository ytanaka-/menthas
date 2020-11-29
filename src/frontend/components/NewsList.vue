<template>
  <div class="newslist" v-touch:swipe="swipeHandler">
    <div class="news-container">
      <div class="top-container-wrap">
      <template v-if="top.main != null">
        <div class="top-left-container">
          <div class="top-main-container">
            <div class="top-box">
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
        </div>
        <div class="top-sub-container-wrap">
        <template v-for="sub in top.sub">
          <div class="top-sub-container" v-bind:key="sub._id">
            <div class="thumbnail-box">
              <a v-bind:href="sub.url" v-on:click="sendGAClick(sub.url, 1)" target="_blank" rel="noopener">
                <img v-bind:src="sub.thumbnail" @error="imageLoadError"/>
              </a>
              </div>
            <div class="text-box">
              <div class="title">
                <a v-bind:href="sub.url" v-on:click="sendGAClick(sub.url, 2)" target="_blank" rel="noopener">
                  <p>{{sub.title}}</p>
                </a>
              </div>
              <div class="meta-info">
                <p class="meta-info-text">
                  from: {{sub.host_name}}, {{sub.categoriesStr}}
                <template v-if="sub.isInfluential == true">
                  ,
                  <span class="highly-influential">Highly Influential News</span>
                </template>
                <template v-if="sub.isNew == true">
                  ,
                  <span class="new">New!</span>
                </template>
                </p>
              </div>
            </div>
          </div>
        </template>
        </div>
        </div>
        <div class="top-section-container-wrap">
          <template v-for="item in top.sections">
            <div class="top-section-container" v-bind:key="item._id">
              <div class="text-box">
                <div class="title">
                  <a v-bind:href="item.url" v-on:click="sendGAClick(item.url, 2)" target="_blank" rel="noopener">
                    <p>{{item.title}}</p>
                  </a>
                </div>
                <div class="meta-info">
                  <p class="meta-info-text">
                    from: {{item.host_name}}, {{item.categoriesStr}}
                  <template v-if="item.isInfluential == true">
                    ,
                    <span class="highly-influential">Highly Influential News</span>
                  </template>
                  <template v-if="item.isNew == true">
                    ,
                    <span class="new">New!</span>
                  </template>
                  </p>
                </div>
                <div class="description">
                  <p class="description-text">{{item.description}}</p>
                </div>
              </div>
            </div>
          </template>
        </div>
      </template>
      </div>
      <template v-for="page in pages">
        <div class="list-container" v-bind:key="page._id">
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
:root
  --list-width "min(100vw, 1030px)" % null
  --top-main-width calc(var(--list-width) * 5.7/10)
  --top-sub-width calc(var(--list-width) * 4.3/10)
  --top-main-image-height calc(var(--top-main-width) * 4.5/10)
  --top-sub-image-height calc(var(--top-sub-width) * 3.9/10)

.newslist
  max-width var(--list-width)
  margin 0 auto
  padding-top 20px
  a
    color #17538a
    font-weight bold
    font-size 22px
    word-wrap break-word
    text-decoration none
  a:visited
    color #6991b8
    text-decoration: none
  a:hover, a:focus
    text-decoration underline

.news-container
  margin auto
  padding 0 20px

.top-container-wrap
  display flex

.top-main-container
  width var(--top-main-width)

.top-sub-container-wrap
  width var(--top-main-width)
  display flex

.title
  display -webkit-box
  -webkit-line-clamp 3
  -webkit-box-orient vertical
  overflow hidden
  a
    font-size 18px
    line-height 1.5

.meta-info
  display -webkit-box
  -webkit-line-clamp 2
  -webkit-box-orient vertical
  overflow hidden
  .meta-info-text
    font-size 11px
    line-height 1.4
    color #8C8C8C
  .highly-influential
    font-size 11px
    line-height 1.4
    color #dd913f
  .new
    font-size 11px
    color #ED0B0B

.description
  display -webkit-box
  -webkit-line-clamp 3
  -webkit-box-orient vertical
  overflow hidden
  .description-text
    font-size 13px
    line-height 1.4
    color #222

.top-box
  display flex
  flex-direction column
  margin-right 27px
  margin-bottom 25px
  padding-bottom 20px
  border-bottom 1px solid #CCC
  .thumbnail-box
    margin-top 4px
    a img
      object-fit cover
      width 100%
      height var(--top-main-image-height)
      clip-path polygon(0 0, 100% 0, 100% 100%, 0 98%)
      -webkit-clip-path polygon(0 0, 100% 0, 100% 100%, 0 98%)
  .title
    margin-top 6px
    margin-bottom 6px
    a
      font-size 20px
      line-height 1.5

.top-sub-container
  width calc(100% * 1/2)
  margin-right 27px
  .thumbnail-box
    a img
      object-fit cover
      width 100%
      height var(--top-sub-image-height)
      clip-path polygon(0 0, 100% 0, 100% 100%, 0 98%)
      -webkit-clip-path polygon(0 0, 100% 0, 100% 100%, 0 98%)
  .title
    margin-top 5px
    margin-bottom 5px
    a
      font-size 16px
      line-height 1.4
  .meta-info
    margin 2px 0px


.top-section-container-wrap
  width var(--top-sub-width)
  margin-bottom 27px
  border-left 1px solid #CCC

.top-section-container
  margin-left 23px
  .text-box
    min-height 130px
    margin-bottom 30px

.text-box
  width 100%
  min-height 90px
  margin-bottom 20px
  .title
    margin-bottom 5px
    a
      font-size 16px
  .meta-info
    margin-bottom 5px
  .description-text
    font-size 12px

.list-container
  max-width 800px
  display flex
  border-top 1px solid #ccc
  padding 12px 6px
  .text-box
    flex 1
    margin-top 5px
    a
      font-size 17px
  .thumbnail-box
    width 120px
    height 90px
    margin 10px 0px
    margin-right 28px
    a img
      object-fit cover
      width 120px
      height 90px
  .meta-info
    margin-bottom 10px


@media screen and (max-width: 480px)
  .top-container-wrap
    display block
  
  .top-main-container
    width 100%

  .top-sub-container-wrap
    width 100%
    display block

  .top-sub-container
    width 100%
    padding-top 20px
    border-top 1px solid #ccc
    .thumbnail-box
      a img
        object-fit cover
        width 100%
        height 120px
    .title
      a
        font-size 17px
        line-height 1.4

  .text-box
    min-height 60px

  .top-section-container-wrap
    width 100%
    margin-bottom 20px
    border-left 0px solid #CCC

  .top-section-container
    margin-left 0px
    padding-top 10px
    border-top 1px solid #ccc

  .top-box
    margin-right 0px
    margin-bottom 10px
    .title
      a
        font-size 17px
        line-height 1.4
    .thumbnail-box
      a img
        height 150px


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
      .description-text
        font-size 12px
        line-height 1.4
  .title
    a
      font-size 16px
      line-height 1.5

</style>