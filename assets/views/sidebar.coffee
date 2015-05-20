React   = require 'react'
Fluxxor = require 'fluxxor'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
  ]

  render: ()->
    that = @
    <ul className="sidebar-nav">
      <li className="sidebar-brand">
        <span> Menthas</span>
      </li>
      <li>
        <span>ニュースカテゴリ</span>
      </li>
      <li>
        <a className="category" onClick={that.props.onCategoryClick.bind(null,"hot")} > # top</a>
      </li>
      {
        @props.categories.map (category)->
          <li key={category} onClick={that.props.onCategoryClick.bind(null,category)}>
            <a className="category" > # {category}</a>
          </li>
      }
    </ul>