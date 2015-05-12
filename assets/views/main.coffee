React   = require 'react'
Fluxxor = require 'fluxxor'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
    Fluxxor.StoreWatchMixin 'ItemStore'
  ]

  getStateFromFlux: ->
    itemStore: @getFlux().store('ItemStore').getState()

  render: ->
    <div>
      {
        @state.itemStore.items.map (item)->
          <div className="col-lg-12 item">
            <div className="col-lg-10">
              <div className="category-color-bar pull-left"
                style={{"backgroundColor": item.category.color}}/>
              <a className="title" href={item.page.url} target="_brank">
                <p>{item.page.title} </p>
              </a>
              <p className="description">{item.page.description}</p>
            </div>
            <div className="col-lg-2">
              <img src={item.page.thumbnail} />
            </div>
          </div>
      }
    </div>