React   = require 'react'
Fluxxor = require 'fluxxor'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
  ]

  # categoriesの取得までul以下を表示しない
  _isVisible: ()->
    if @props.categories.length is 0
      return {
        visibility: "hidden"
      }

  render: ()->
    that = @
    <ul className="sidebar-nav" style=@_isVisible()>
      <li className="sidebar-brand">
        <img src="./images/logo.svg" height="46"/>
      </li>
      <li>
        <span>ニュースカテゴリ</span>
      </li>
      <li>
        <a className="category" onClick={that.props.onCategoryClick.bind(null,"hot")} > # top</a>
      </li>
      {
        @props.categories.map (category)->
          <li key={category} onClick={that.props.onCategoryClick.bind(null,category)} >
            <a className="category" > # {category}</a>
          </li>
      }
    </ul>