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
        <div className="category-color-bar row">
          {
            length = item.others.length + 1
            if length > 4
              length = 4
            categoryCol = 12/length
            for i in [0...length]
              if i == 0
                <div className="col-xs-#{categoryCol} category-color-bar-helper" style={"backgroundColor": item.category.color} />
              else
                <div className="col-xs-#{categoryCol} category-color-bar-helper" style={"backgroundColor": item.others[i-1].category.color} />

          }
          <a className="category-text" href="/#{item.category.name}" target="_brank">
            <span className="category-name">{item.category.name}</span>
          </a>
          <a className="hatebu-user-text" href="http://b.hatena.ne.jp/entry/#{item.page.url}" target="_brank">
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