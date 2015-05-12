mongoose = require 'mongoose'

PageSchema = new mongoose.Schema
  url: { type: String, index:{ unique:true }, required:true }
  title: String
  description: String
  thumbnail: String
  site_name: String
  hatebu: { type: Number, default: 0 }
  tags: [ String ]
  timestamp: { type: Date, default: Date.now, index: true }

PageSchema.statics =
  findById: (id,cb)->
    @findOne({_id:id})
    .exec(cb)

  findPages: (skip,size,cb)->
    @find({})
    .skip(skip)
    .limit(size)
    .sort({_id:-1})
    .exec(cb)

  findByURL: (url,cb)->
    @findOne({url:url})
    .exec(cb)

exports.Page = mongoose.model 'Page',PageSchema