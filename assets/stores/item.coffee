Fluxxor = require 'fluxxor'
_ = require 'underscore'

module.exports = ()->

  Fluxxor.createStore

    initialize: ()->
      @items = []
      @bindActions 'insertItem', @insertItem
      @bindActions 'insertItemList', @insertItemList

    getState: ()->
      items: @items

    getItemsLength: ()->
      @items.length

    insertItem: (item)->
      @items.push item
      @emit 'change'

    insertItemList: (itemList)->
      @items = _.union @items,itemList
      @emit 'change'