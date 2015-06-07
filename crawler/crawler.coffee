_ = require 'underscore'
path = require 'path'
async = require 'async'
kue = require 'kue'
debug = require('debug')('crawler')
config = require 'config'
mongoose = require 'mongoose'
LRU = require 'lru-cache'
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
    @bookmarkCache = LRU()
    @hatebuCache = LRU() # urlに対するブクマ数をキャッシュ
    # webclientを有効化
    kue.app.listen 5000

  startAndInterval: ()->
    that = @
    @start()
    setInterval ()->
      that.start()
    ,1000*60*60*12

  start: ()->
    debug "[start]CrawlerJob"
    that = @
    @bookmarkCache.reset()
    @hatebuCache.reset()
    Category.find {},(err,categorys)->
      _.each categorys,(category)->
        curators = category.curators
        _.each curators,(curator)->
          that.fetchBookmark category,curator


  fetchBookmark: (category,curator)->
    that = @
    that.jobs.create("fetchBookmark",{
      title: "fetchBookmark: #{curator}"
      curator: curator
    }).on("complete",(urls)->
      that.fetchURLs category,curator,urls
    ).on("failed",(err)->
      debug err
    ).save()

  fetchURLs: (category,curator,urls)->
    that = @
    _.each urls,(url)->
      that.jobs.create("fetchURL",{
        title: "fetchURL: #{url}"
        url: url
      }).on("complete",(page)->
        that.fetchItem category,curator,page.url
      ).on("failed",(err)->
        debug err
      ).save()

  fetchItem: (category,curator,url)->
    that = @
    @jobs.create("fetchItem",{
      title: "fetchItem"
      curator: curator
      category: category
      url: url
    }).on("complete",()->
      that.fetchHatebuCount url
    ).on("failed",(err)->
      debug err
    ).save()

  fetchHatebuCount: (url)->
    @jobs.create("fetchHatebuCount",{
      title: "getBookmarkCount: #{url}"
      url: url
    }).on("failed",(err)->
      debug err
    ).ttl(1000*60*30).save()

  setJobProcess: ()->
    that = @
    @jobs.process "fetchBookmark",1,(job,done)->
      curator = job.data.curator
      # cacheにあるかチェック
      if that.bookmarkCache.has curator
        return done null,that.bookmarkCache.get curator
      debug "[start]fetchBookmark"
      hatebuClient.getBookmarkerURLList curator,0,(err,urls)->
        setTimeout ()->
          return done err if err
          debug "[end]fetchBookmark"
          that.bookmarkCache.set curator,urls
          done null,urls
        ,1000*10

    @jobs.process "fetchURL",2,(job,done)->
      url = job.data.url
      that.findPage url,(err,page)->
        return done err if err
        setTimeout ()->
          done null,page
        ,1000

    @jobs.process "fetchHatebuCount",1,(job,done)->
      url = job.data.url
      # cacheにあるかチェック
      if that.hatebuCache.has url
        return done null,that.hatebuCache.get url
      Page.findByURL url,(err,page)->
        return done err if err
        return done if not page
        hatebuClient.getBookmarkCount url,(err,count)->
          return done err if err
          page.hatebu = count
          page.save (err)->
            return done err if err
            setTimeout ()->
              that.hatebuCache.set url,count
              done()
            ,1000

    @jobs.process "fetchItem",(job,done)->
      category = job.data.category
      curator = job.data.curator
      url = job.data.url
      # category._idなことに注意
      Page.findByURL url,(err,page)->
        return done err if err
        return done if not page
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
              return done()
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
            return done null,page
      else
        done null,page


job = new CrawlerJob
job.startAndInterval()