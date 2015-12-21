module.exports.HomeEvent = (app)->
  _      = require 'underscore'
  path = require 'path'
  debug  = require('debug')('events/home')
  Category = app.get("models").Category

  index: (req,res,next)->
    return res.render "index",{}

  category: (req,res,next)->
    categoryName = req.params.category
    if categoryName is "top"
      return res.render "index",{}
    Category.getCategoriesList (err,list)->
      return res.sendStatus(500) if err
      if !_.contains list,categoryName
        return res.sendStatus(404)
      return res.render "index",{
        category: categoryName
      }


