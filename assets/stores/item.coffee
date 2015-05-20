Fluxxor = require 'fluxxor'
_ = require 'underscore'

module.exports = ()->

  Fluxxor.createStore

    initialize: ()->
      @items = []
      @bindActions 'insertItemList', @insertItemList
      @bindActions 'reloadItemList', @reloadItemList

    getState: ()->
      items: @items

    getItemsLength: ()->
      @items.length

    insertItemList: (itemList)->
      @items = _.union @items,itemList
      @emit 'change'

    reloadItemList: (itemList)->
      @items = itemList
      @emit 'change'