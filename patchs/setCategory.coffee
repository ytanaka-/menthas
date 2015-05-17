###
 rootとなるチャンネルを作成する
###
async = require 'async'
path = require 'path'
config = require 'config'
mongoose = require 'mongoose'
# connect
MONGOURL = config.get "mongodb.url"
mongoose.connect MONGOURL
Category = (require path.resolve 'models','category').Category
categorys = (require path.resolve 'patchs','category.json').categorys

async.each categorys,(category,next)->
  Category.findByName category.name,(err,result)->
    return next err if err
    if result
      console.log "既に#{category.name}カテゴリは作成済み"
      return next()
    category = new Category
      name: category.name
      title: category.title
      description: category.description
      color: category.color
      keywords: category.tags
      curators: category.curators
    category.save (err)->
      return next err if err
      console.log "#{category.name}カテゴリを作成"
      next()
,(err)->
  console.log err if err
  mongoose.disconnect()