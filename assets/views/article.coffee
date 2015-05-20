React = require 'react'
Fluxxor = require 'fluxxor'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
  ]

  render: ()->
    item = @props.item
    <div className="col-md-4 clear-padding">
      <div className=" item effect">
        <div className="category-color-bar"
          style={{"backgroundColor": item.category.color}} >
          <a href="/#{item.category.name}" target="_brank">
            <span className="category-name">{item.category.name}</span>
          </a>
          <a href="http://b.hatena.ne.jp/entry/#{item.page.url}" target="_brank">
            <span className="hatebu-users pull-right">Users</span>
            <span className="hatebu-count pull-right">{item.page.hatebu}</span>
          </a>
        </div>
        <div className="thumbnail-box">
          <a href={item.page.url} target="_brank">
            <img src={item.page.thumbnail} />
          </a>
        </div>
        <div className="item-footer">
          <div className="title-description">
            <a className="title" href={item.page.url} target="_brank">
              <p>{item.page.title} </p>
            </a>
            <p className="description">{item.page.description}</p>
          </div>
          <p className="source">From: {item.page.site_name}</p>
        </div>
      </div>
    </div>