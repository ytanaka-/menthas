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
    that = @
    <div>
      {
        @state.itemStore.items.map (item,i)->
          if i & 3 == 0
            <div className="row">
              {that.itemHelper item}
            </div>
          else
            <div>
              {that.itemHelper item}
            </div>
      }
    </div>

  itemHelper: (item)->
    <div className="col-md-3 item">
      <div className="category-color-bar"
        style={{"backgroundColor": item.category.color}}>
        <p>item.category.name</p>
      </div>
      <img src={item.page.thumbnail} />
      <div className="item-footer">
        <a className="title" href={item.page.url} target="_brank">
          <p>{item.page.title} </p>
        </a>
        <p className="description">{item.page.description}</p>
      </div>
    </div>