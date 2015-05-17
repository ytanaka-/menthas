_ = require 'underscore'
path = require 'path'
async = require 'async'
kue = require 'kue'
debug = require('debug')('webCrawler')
config = require 'config'
mongoose = require 'mongoose'
Category = (require path.resolve 'models','category').Category
Item = (require path.resolve 'models','item').Item
Page = (require path.resolve 'models','page').Page
# clients
HatebuClient = (require path.resolve 'crawler','HatebuClient')
hatebuClient = new HatebuClient
WebPageClient = (require path.resolve 'crawler','WebPageClient')
webPageClient = new WebPageClient
# connect mongodb
MONGOURL = config.get "mongodb.url"
mongoose.connect MONGOURL


CrawlerJob = class CrawlerJob
  constructor: ()->
    @jobs = kue.createQueue()
    @setJobProcess()
    # webclientを有効化
    kue.app.listen 5000

  start: ()->
    that = @
    Category.find {},(err,categorys)->
      _.each categorys,(category)->
        curators = category.curators
        _.each curators,(curator)->
          that.jobs.create("fetchBookmark",{
            title: "fetchBookmark: #{curator}"
            curator: curator
          }).on("complete",(urls)->
            # start bookmarkList's crawl
            that.crawl category,curator,urls
          ).on("failed",(err)->
            debug err
          ).ttl(1000*10).save()


  crawl: (category,curator,urls)->
    that = @
    _.each urls,(url)->
      that.jobs.create("fetchURL",{
        title: "fetchURL: #{url}"
        url: url
      }).on("complete",(page)->

        that.jobs.create("fetchItem",{
          title: "fetchItem"
          curator: curator
          category: category
          page: page
        }).on("complete",()->
          debug "[#{url}]の取得が完了"
          # hatebuのブックマーク数を取得し登録する
          that.jobs.create("fetchBookmarkCount",{
            title: "getBookmarkCount: #{url}"
            url: url
          }).on("failed",(err)->
            debug err
          ).ttl(1000).save()

        ).on("failed",(err)->
          debug err
        ).ttl(1000*5).save()

      ).on("failed",(err)->
        debug err
      ).ttl(1000*10).save()

  setJobProcess: ()->
    that = @
    @jobs.process "fetchBookmark",1,(job,done)->
      curator = job.data.curator
      hatebuClient.getBookmarkerURLList curator,0,(err,urls)->
        return done err if err
        setTimeout ()->
          done null,urls
        ,1000

    @jobs.process "fetchURL",2,(job,done)->
      url = job.data.url
      that.findPage url,(err,page)->
        return done err if err
        setTimeout ()->
          done null,page
        ,1000

    @jobs.process "fetchBookmarkCount",(job,done)->
      url = job.data.url
      Page.findByURL url,(err,page)->
        return done err if err
        return done if not page
        hatebuClient.getBookmarkCount url,(err,count)->
          return done err if err
          page.hatebu = count
          page.save (err)->
            return done err if err
            done()

    @jobs.process "fetchItem",(job,done)->
      category = job.data.category
      curator = job.data.curator
      page = job.data.page
      # category._idなことに注意
      Item.findByCategoryAndUrl category._id,page._id,(err,item)->
        return done err if err
        if not item
          item = new Item
            category: category._id
            page: page._id
            score: 1
            picks: [ curator ]
          # pageのtitleとdescriptionにkeywordが含まれていた場合scoreに加算
          str = page.title + ":" + page.description
          keywords = category.keywords
          if ( _.some keywords,(keyword)-> return !!~ str.indexOf keyword ) is true
            item.score = item.score + 2
          item.save (err)->
            return done err if err
            done()
        else
          if not _.contains item.picks,curator
            item.score = item.score + 1
            item.picks.push curator
            item.timestamp = new Date()
            debug "scoreにpicksから更新があるっぽい score=#{item.score}"
            item.save (err)->
              debug err if err
              return done()
          else
            done()


  findPage :(url,done)->
    Page.findByURL url,(err,page)->
      return done err if err
      if not page
        webPageClient.fetch url,(err,result)->
          return done err if err
          page = new Page
            url: result.url
            title: result.title
            description: result.description
            thumbnail: result.thumbnail
            site_name: result.site_name
          page.save (err)->
            return done err if err
            done null,page
      else
        done null,page


job = new CrawlerJob
job.start()
