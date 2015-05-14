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

  getCategoriesList: (cb)->
    list = [
      "javascript",
      "programming",
      "dev",
      "design",
      "apple",
      "ios-dev",
      "pc",
      "mobile",
      "social",
      "life",
      "marketing",
      "web-design",
      "web-front",
      "algorithm",
      "infrastructure",
      "network",
      "database",
      "security"
    ]
    return cb null,list

exports.Category = mongoose.model 'Category',CategorySchema