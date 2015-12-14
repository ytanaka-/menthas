React = require 'react'
Fluxxor = require 'fluxxor'
OverlayTrigger = require('react-bootstrap').OverlayTrigger
Popover = require('react-bootstrap').Popover

PopoverContent = require './popoverContent'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
  ]

  _categoryStyle: (item)->
    return {
      backgroundColor: item.category.color
      width: "100%"
    }


  render: ()->
    item = @props.item
    <div className="col-md-4 clear-padding">
      <div className=" item effect">
        <div className="category-color-bar">
          {
            <div className="category-color-bar-main" style={@_categoryStyle(item)}>
              <a className="category-text" href="/#{item.category.name}" target="_blank">
                <span className="category-name">{item.category.name}</span>
              </a>
              <a className="hatebu-user-text" href="http://b.hatena.ne.jp/entry/#{item.page.url}" target="_blank">
                <span className="hatebu-users pull-right">Users</span>
                <span className="hatebu-count pull-right">{item.page.hatebu}</span>
              </a>
            </div>
          }
        </div>
        <div className="thumbnail-box">
          <a href={item.page.url} target="_blank">
            <img src={item.page.thumbnail} />
          </a>
        </div>
        <div className="item-footer">
          <div className="title-description">
            <a className="title" href={item.page.url} target="_blank">
              <p>{item.page.title} </p>
            </a>
            <p className="description">{item.page.description}</p>
          </div>
          <p className="source">From: {item.page.site_name}</p>
        </div>
      </div>
    </div>