Fluxxor = require 'fluxxor'
_ = require 'underscore'

module.exports = ()->

  Fluxxor.createStore

    initialize: ()->
      @name = {}
      @description = {}
      @categories = []
      @bindActions 'fetchCategoryParams', @storeCategory

    getState: ()->
      name: @name
      description: @description
      categories: @categories

    storeCategory: (category)->
      @name = category.name
      @description = category.description
      @categories = category.categories
      @emit 'change'