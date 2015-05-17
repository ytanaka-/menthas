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
      result.name = category.name
      result.description = category.description
      result.color = category.color
      result.curators = category.curators
      result.save (err)->
        return next err if err
        next()
,(err)->
  console.log err if err
  mongoose.disconnect()
