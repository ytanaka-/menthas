module.exports.CategoryEvent = (app) ->
  _      = require 'underscore'
  path = require 'path'
  RSS = require 'rss'
  debug  = require('debug')('events/category')
  Category = app.get("models").Category
  Item = app.get("models").Item

  # デフォルト定数
  ITEM_SIZE = 33
  RSS_SIZE = 25
  SCORE_THRESHOLD = 4
  HOT_THRESHOLD = 5

  params: (req,res,next)->
    categoryName = req.params.category
    Category.getCategoriesList (err,list)->
      if categoryName is "top" || !_.contains list,categoryName
        categoryName = "top"
        return res.json {
            category:
              name: categoryName
              description: "各カテゴリのHotNews"
              categories: list
          }
      Category.findByName categoryName,(err,category)->
        if err || !category
          debug err
          return res.sendStatus(500)
        res.json {
          category:
            name: categoryName
            description: category.description
            categories: list
        }

  list: (req,res,next)->
    categoryName = req.params.category
    size = req.query.size ? ITEM_SIZE
    offset = req.query.offset ? 0
    score = req.query.score ? SCORE_THRESHOLD
    Category.findByName categoryName,(err,category)->
      if err || !category
        debug err
        return res.sendStatus(500)
      Item.findByCategory category._id,score,size,offset,(err,result)->
        if err
          debug err
          return res.sendStatus(500)
        return res.json {
          items: result
        }

  # 全カテゴリを対象に指定score以上のitemを取得する
  topList: (req,res,next)->
    size = req.query.size ? ITEM_SIZE
    offset = req.query.offset ? 0
    score = req.query.score ? HOT_THRESHOLD
    Item.findByScore score,size,offset,(err,result)->
      if err
        debug err
        return res.sendStatus(500)
      return res.json {
        items: result
      }

  rss: (req,res,next)->
    categoryName = req.params.category
    @_generateRSS categoryName,(err,result)->
      if err
        debug err
        return res.sendStatus(500)
      res.set 'Content-Type', 'text/xml'
      res.send result

  _generateRSS: (categoryName,callback)->
    that = @
    if categoryName is "top"
      Item.findByScore HOT_THRESHOLD, RSS_SIZE, 0,(err,items)->
        return callback err if err
        callback null, that._convertItemsToRSS items,categoryName
    else
      Category.findByName categoryName,(err,category)->
        if err || !category
          return callback err
        Item.findByCategory category._id, SCORE_THRESHOLD, RSS_SIZE, 0, (err,items)->
          return callback err if err
          callback null, that._convertItemsToRSS items,categoryName

  _convertItemsToRSS: (items,category)->
    feed = new RSS
      title: "Menthas[#{category}]"
      description: 'プログラマ向けのニュースキュレーションサービスです。'
      feed_url: "http://menthas.com/#{category}/rss"
      site_url: 'http://menthas.com',
    _.each items,(item)->
      feed.item
        title: item.page.title
        description: item.page.description
        url: item.page.url
        date: item.page.timestamp
    return feed.xml()
