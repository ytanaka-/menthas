React = require 'react'
Fluxxor = require 'fluxxor'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
  ]

  _helper: (category)->
    return {
      backgroundColor: category.color
      height: "20px"
      width: "10px"
    }

  render : ()->
    <div className="list-group">
    {
      @props.sharedCategories.map (shared)=>
        <a className="list-group-item" href="/#{shared.category.name}">
          <div className="pull-left" style={@_helper shared.category} />
          <span className="popover-category-text">{shared.category.name}</span>
        </a>
    }
    </div>