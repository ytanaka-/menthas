Fluxxor = require 'fluxxor'
_ = require 'underscore'

module.exports = ()->

  Fluxxor.createStore

    initialize: ()->
      @items = []
      @_urls = []
      @bindActions 'insertItemList', @insertItemList
      @bindActions 'reloadItemList', @reloadItemList

    getState: ()->
      items: @items

    getItemsLength: ()->
      @items.length

    insertItemList: (itemList)->
      _.each itemList,(item)=>
        if /.gif$/.test item.page.url
          return
        if !_.contains @_urls,item.page.url
          @items.push item
          @_urls.push item.page.url
      @emit 'change'

    reloadItemList: (itemList)->
      @items = []
      @_urls = []
      @insertItemList itemList