async = require 'async'
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


  findByCategoryAndSetOthers: (category_id,score,size,offset,cb)->
    that = @
    @findByCategory category_id,score,size,offset,(err,items)->
      cb err if err
      that._addOtherCategories items,score,(err,result)->
        cb err if err
        cb null,result

  findAndSetOthers: (score,size,offset,cb)->
    that = @
    @findByScore score,size,offset,(err,items)->
      cb err if err
      that._addOtherCategories items,score,(err,result)->
        cb err if err
        cb null,result

  _addOtherCategories: (items,score,cb)->
    that = @
    array = []
    async.eachSeries items,(item,next)->
      that._findOtherCategories item.page._id,item.category._id,score,(err,result)->
        next err if err
        item.others = result
        array.push item
        next()
    ,(err)->
      cb err if err
      cb null,array

  _findOtherCategories: (page_id,category_id,score,cb)->
    @find({page: page_id, score: { $gte:score }, category: {$ne: category_id}})
    .populate("category")
    .exec(cb)


exports.Item = mongoose.model 'Item',ItemSchema