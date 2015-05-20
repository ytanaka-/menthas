React   = require 'react'
Fluxxor = require 'fluxxor'

## Flux stores,actions
flux = new Fluxxor.Flux
  ItemStore: new (require('./stores/item')())
  CategoryStore: new (require('./stores/category')())
, require('./actions/actions')()

## View
View = require './views/main'

React.render <View flux={flux} />
, document.getElementById 'wrapper'
