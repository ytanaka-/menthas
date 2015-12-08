client = require 'cheerio-httpcli'
request = require 'request'
_ = require 'underscore'
xml2js = require 'xml2js'
parser = new xml2js.Parser()

module.exports = class HatebuClient

  getEntryArray: (url,cb)->
    client.fetch url, (err,$,res)->
      if err
        return cb err
      array = []
      $('.entry-link').each ()->
        entry = $(this).attr 'href'
        array.push entry
      return cb null,array

  getHotentry: (category,cb)->
    url = "http://b.hatena.ne.jp/entrylist/#{category}.rss?sort=hot"
    request url, (err, response, body)->
      if err
        return cb err
      parser.parseString body, (err,data) ->
        if err
          return cb err
        entrys = []
        items = data["rdf:RDF"].item
        _.each items,(item)->
          # remove html-tags
          description = item.description[0]
          if description
            description = description.replace /<("[^"]*"|'[^']*'|[^'">])*>/g,''
          entrys.push {
            link: item.link[0]
            title: item.title[0]
            description: description
            bookmark: item["hatena:bookmarkcount"][0]
          }
        cb null,entrys


  getBookmarkInfo: (url,cb)->
    options =
      url: "http://b.hatena.ne.jp/entry/json/#{url}"
      headers:
        "User-Agent":'menthas.com'

    request options, (err, response, body)->
      if err
        return cb err
      cb null,body

  # ブクマ数を調べる 0の場合はnullが返るらしい
  getBookmarkCount: (url,cb)->
    url = "http://api.b.st-hatena.com/entry.count?url=#{url}"
    request url, (err, response, body)->
      if err
        return cb err
      if response.statusCode isnt 200
        return cb new Error "StatusCode Error"
      if not body
        body = 0
      cb null,body

  # output array
  # お気に入りに登録したURLの配列を返す
  # offsetは20件単位で指定
  getBookmarkerURLList: (name,offset,cb)->
    @getBookmarkerRSS name,offset,(err,result)->
      if err
        return cb err
      parser.parseString result, (err, data) ->
        if err
          return cb err
        if not data["rdf:RDF"]
          return cb new Error "Not data[rdf:RDF]"
        items = data["rdf:RDF"].item
        links = []
        _.each items,(item)->
          links.push item.link[0]
        cb null,links

  getBookmarkerRSS: (name,offset,cb)->
    options =
      url: "http://b.hatena.ne.jp/#{name}/rss?of=#{offset}"
      headers:
        "User-Agent": 'menthas.com'

    request options, (err, response, body)->
      if err
        return cb err
      cb null,body
