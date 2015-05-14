mongoose = require 'mongoose'

ItemSchema = new mongoose.Schema
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
  page: { type: mongoose.Schema.Types.ObjectId, ref: 'Page'}
  score: { type: Number, default: 0 }
  picks: [ String ]
  timestamp: { type: Date, default: Date.now, index: true }

ItemSchema.statics =
  findById: (id,cb)->
    @findOne({_id:id})
    .populate("category")
    .populate("page")
    .exec(cb)

  findByScore: (score,size,offset,cb)->
    @find({ score: { $gte:score }})
    .populate("category")
    .populate("page")
    .sort({timestamp: -1})
    .limit(size)
    .skip(offset)
    .exec(cb)

  findByCategory: (category_id,score,size,offset,cb)->
    @find({category: category_id, score: { $gte:score }})
    .populate("category")
    .populate("page")
    .sort({timestamp: -1})
    .limit(size)
    .skip(offset)
    .exec(cb)

  findByCategoryAndUrl: (category_id,page_id,cb)->
    @findOne({category: category_id,page: page_id})
    .populate("page")
    .populate("category")
    .exec(cb)

exports.Item = mongoose.model 'Item',ItemSchema