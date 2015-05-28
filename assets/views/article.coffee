React = require 'react'
Fluxxor = require 'fluxxor'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
  ]

  _categoryStyle: (i,length,item)->
    subCategoryWidth = 4
    if i is 0 and length is 1
      return {
        backgroundColor: item.category.color
        width: "100%"
      }
    else if i is 0
      return {
        backgroundColor: item.category.color
        width: 100 - subCategoryWidth*(length-1) + "%"
      }
    else
      return {
        backgroundColor: item.others[i-1].category.color
        width: subCategoryWidth + "%"
      }


  render: ()->
    item = @props.item
    <div className="col-md-4 clear-padding">
      <div className=" item effect">
        <div className="category-color-bar">
          {
            length = item.others.length + 1
            for i in [0...length]
              if i is 0
                <div className="category-color-bar-main" style={@_categoryStyle(i,length,item)}>
                  <a className="category-text" href="/#{item.category.name}" target="_brank">
                    <span className="category-name">{item.category.name}</span>
                  </a>
                  <a className="hatebu-user-text" href="http://b.hatena.ne.jp/entry/#{item.page.url}" target="_brank">
                    <span className="hatebu-users pull-right">Users</span>
                    <span className="hatebu-count pull-right">{item.page.hatebu}</span>
                  </a>
                </div>
              else
                <div className="category-color-bar-helper" style={@_categoryStyle(i,length,item)} />
          }
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