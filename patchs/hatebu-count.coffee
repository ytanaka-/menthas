_ = require 'underscore'
path = require 'path'
async = require 'async'
config = require 'config'
mongoose = require 'mongoose'
HatebuClient = (require path.resolve 'crawler','HatebuClient')
hatebuClient = new HatebuClient
Page = (require path.resolve 'models','page').Page
# connect mongodb
MONGOURL = config.get "mongodb.url"
mongoose.connect MONGOURL

Page.find({}).skip(1000).exec (err,pages)->
  async.eachSeries pages,(page,cb)->
    hatebuClient.getBookmarkCount page.url,(err,result)->
      if err
        return cb err
      console.log result
      page.hatebu = result
      page.save (err)->
        return cb err if err
        setTimeout ()->
          cb()
        ,100

  ,(err)->
    console.log err if err
