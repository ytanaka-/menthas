client = require 'cheerio-httpcli'
request = require 'request'
_ = require 'underscore'

module.exports = class WebPageClient

  # urlからpageのmetaデータを取得
  fetch: (url,callback)->
    client.fetch url, (err,$,res)->
      return callback err if err
      # statusCodeが200でない場合はエラーを飛ばす
      if res.statusCode is not 200
        return callback new Error("#{url} is statusCode[#{res.statusCode}]")
      page = {}
      page.url = url
      page.title = $("title").text()
      if not page.title or page.title == ""
        return callback new Error("#{url} is empty of title")

      page.thumbnail = $("meta[property='og:image']").attr("content")
      page.site_name = $("meta[property='og:site_name']").attr("content")

      description = $("meta[property='og:description']").attr("content")
      if not description
        description = $("meta[name='description']").attr("content")
      # htmlタグ避け
      if description
        description = description.replace /<("[^"]*"|'[^']*'|[^'">])*>/g,''
      page.description = description

      callback null,page
