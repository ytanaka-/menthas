request = require 'superagent'

module.exports = ()->
  item:
    fetchItems: (category,offset = 0)->
      that = @
      request.get "/#{category}/list?offset=#{offset}",(err,res)->
        return console.log err if err
        json = JSON.parse res.text
        that.dispatch "insertItemList",json.items