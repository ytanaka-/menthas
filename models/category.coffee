_ = require 'underscore'
mongoose = require 'mongoose'

CategorySchema = new mongoose.Schema
  name: { type: String, index:{ unique:true }, required:true }
  title: String
  description: String
  color: String
  keywords: [ String ]
  curators: [ String ]

CategorySchema.statics =
  findByName: (name,cb)->
    @findOne({name:name})
    .exec(cb)

  # 現在Topに出るCategoryを配列にして返す
  findByCurrentCategory: (cb)->
    that = @
    @getCategoriesList (err, categoryList)->
      query = {}
      q = []
      _.each categoryList,(name)->
        q.push {"name": name}
      query.$or = q

      that.find query, (err, result)->
        cb err if err
        cb null, result


  getCategoriesList: (cb)->
    list = [
      "javascript",
      "php",
      "java",
      "ruby",
      "python",
      "objective-c",
      "programming",
      "design",
      "android",
      "ios",
      "windows",
      "machine-learning",
      "gadget",
      "social",
      "security",
      "infrastructure",
      "iot"
    ]
    return cb null,list

exports.Category = mongoose.model 'Category',CategorySchema