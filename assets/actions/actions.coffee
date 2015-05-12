request = require 'superagent'

module.exports = ()->
  item:
    fetchItems: (category)->
      that = @
      request.get "http://localhost:4000/#{category}/list",(err,res)->
        return console.log err if err
        json = JSON.parse res.text
        that.dispatch "insertItemList",json.items