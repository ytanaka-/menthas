React   = require 'react'
Fluxxor = require 'fluxxor'

## Flux stores,actions
flux = new Fluxxor.Flux
  ItemStore: new (require('./stores/item')())
, require('./actions/actions')()

## View
View = require './views/main'

React.render <View flux={flux} />
, document.getElementById 'main-container'

category = (window.location.pathname).substr(1) ? "hot"
flux.actions.item.fetchItems category