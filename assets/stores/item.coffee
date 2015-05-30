Fluxxor = require 'fluxxor'
_ = require 'underscore'

module.exports = ()->

  Fluxxor.createStore

    initialize: ()->
      @items = []
      @itemIds = []
      @bindActions 'insertItemList', @insertItemList
      @bindActions 'reloadItemList', @reloadItemList

    getState: ()->
      items: @items

    getItemsLength: ()->
      @items.length

    insertItemList: (itemList)->
      _.each itemList,(item)=>
        if !_.contains @itemIds,item._id
          @items.push item
          @itemIds.push item._id
      @emit 'change'

    reloadItemList: (itemList)->
      @items = []
      @itemIds = []
      @insertItemList itemList