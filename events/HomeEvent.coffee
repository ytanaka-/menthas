module.exports.HomeEvent = (app)->
  _      = require 'underscore'
  path = require 'path'
  debug  = require('debug')('events/home')

  index: (req,res,next)->
    res.render "index",
    title: "Express"