#
# httpリクエスト用ルーティング設定
#

module.exports = (app) ->
  debug = require('debug')('routes/main')
  HomeEvent = app.get('events').HomeEvent app
  CategoryEvent = app.get('events').CategoryEvent app

  app.get '/', (req,res,next)-> HomeEvent.index req,res,next
  app.get '/:category', (req,res,next)-> HomeEvent.category req,res,next

  app.get '/top/list', (req,res,next)-> CategoryEvent.topList req,res,next

  # TopのRSSリストを取得(@deprecated)
  app.get '/hot/rss', (req,res,next)-> res.redirect "/top/rss"

  # CategoryEvent Controller
  app.get '/:category/list', (req,res,next)-> CategoryEvent.list  req,res,next
  app.get '/:category/rss',  (req,res,next)-> CategoryEvent.rss   req,res,next

  app.get '/:category/params', (req,res,next)-> CategoryEvent.params req,res,next