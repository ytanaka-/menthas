React   = require 'react'
Fluxxor = require 'fluxxor'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
    Fluxxor.StoreWatchMixin 'ItemStore'
  ]

  getStateFromFlux: ->
    itemStore: @getFlux().store('ItemStore').getState()

  componentDidMount: ->
    @state.loading = false
    window.addEventListener('scroll',@checkWindowScroll)

    # start
    category = (window.location.pathname).substr(1)
    if not category
      category = "hot"
    @state.category = category
    @getFlux().actions.item.fetchItems category

  componentDidUpdate: (prevProps, prevState)->
    @state.loading = false

  checkWindowScroll: ->
    # Get scroll pos & window data
    h = document.documentElement.clientHeight
    s = (document.body.scrollTop or document.documentElement.scrollTop or 0)
    scrolled = (h + s) >= document.body.offsetHeight
    # If scrolled enough, not currently paging and not complete...
    if scrolled and !@state.loading
      @state.loading = true
      size = @getFlux().store('ItemStore').getItemsLength()
      @getFlux().actions.item.fetchItems @state.category,size

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
        <a href={item.page.url} target="_brank">
          <img src={item.page.thumbnail} />
        </a>
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