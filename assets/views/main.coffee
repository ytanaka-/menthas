React   = require 'react'
Fluxxor = require 'fluxxor'

Sidebar = require './sidebar'
Article = require './article'

module.exports = React.createClass
  mixins: [
    Fluxxor.FluxMixin React
    Fluxxor.StoreWatchMixin 'ItemStore'
  ]

  getStateFromFlux: ->
    itemStore: @getFlux().store('ItemStore').getState()
    categoryStore: @getFlux().store('CategoryStore').getState()

  componentDidMount: ->
    # menu-toggle
    $("#menu-toggle").click (e)->
      e.preventDefault()
      $("#wrapper").toggleClass("toggled")

    # set scroll init
    @state.isload = true
    window.addEventListener('scroll',@checkWindowScroll)

    # start
    category = (window.location.pathname).substr(1)
    if not category
      category = "top"
    @state.category = category
    @getFlux().actions.item.fetch category
    @getFlux().actions.category.fetchParams category

  componentDidUpdate: (prevProps, prevState)->
    @state.isload = true

  checkWindowScroll: ->
    # Get scroll pos & window data
    h = document.documentElement.clientHeight
    s = (document.body.scrollTop or document.documentElement.scrollTop or 0)
    if document.body.scrollHeight != 0
      scrolled = (h + s) >= document.body.scrollHeight
    else
      scrolled = false

    # If scrolled enough, not currently paging and not complete...
    if scrolled and @state.isload
      @state.isload = false
      @size = @getFlux().store('ItemStore').getItemsLength()
      @getFlux().actions.item.fetch @state.category,@size

  onCategoryClick: (category)->
    if @state.category != category
      # 一旦replaceStateでurlを再リロード対応
      if category == "top"
        history.replaceState null,null,"/"
      else
        history.replaceState null,null,"/#{category}"

      window.scroll 0,0
      @state.category = category
      @getFlux().actions.item.reload category
      @getFlux().actions.category.fetchParams category

  render: ->
    <div className="app-wrapper">
      <div id="sidebar-wrapper">
        <Sidebar
          currentCategory= {@state.category}
          categories= {@state.categoryStore.categories}
          onCategoryClick= {@onCategoryClick} />
      </div>
      <div id="header">
        <span id="menu-toggle" className="category-title">
          <img src="./images/hamburger.svg" height="20" />
          <span className="category-title-text">{@state.categoryStore.name}</span>
        </span>
        <span className="category-description"> {@state.categoryStore.description}</span>
      </div>
      <div id="page-content-wrapper">
        <div className="container-fluid">
          <div id="main-container">
            <div>
              {
                @state.itemStore.items.map (item,i)->
                  if i & 3 == 0
                    <div key={item._id} className="row">
                      <Article item={item}/>
                    </div>
                  else
                    <div key={item._id}>
                      <Article item={item}/>
                    </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
