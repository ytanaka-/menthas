#
# httpリクエスト用ルーティング設定
#

module.exports = (app) ->
  debug = require('debug')('routes/main')
  HomeEvent = app.get('events').HomeEvent app
  CategoryEvent = app.get('events').CategoryEvent app

  app.get '/', (req,res,next)-> HomeEvent.index req,res,next
  app.get '/:category', (req,res,next)-> HomeEvent.category req,res,next

  # Top用のリストを取得
  app.get '/hot/list', (req,res,next)-> CategoryEvent.hotList req,res,next
  # CategoryEvent Controller
  app.get '/:category/list', (req,res,next)-> CategoryEvent.list  req,res,next
  app.get '/:category/rss',  (req,res,next)-> CategoryEvent.rss   req,res,next

  app.get '/:category/params', (req,res,next)-> CategoryEvent.params req,res,next