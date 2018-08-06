const client = require("cheerio-httpcli")
const request = require("request")
const xml2js = require("xml2js")
const config = require("config")
const parser = new xml2js.Parser();
const UA = config.crawler.UA

class HatebuClient {

  // Hotエントリ or 新着からURLを抜き出す
  getEntryArray(url, cb) {
    return client.fetch(url, (err, $, res) => {
      if (err) {
        return cb(err);
      }
      let array = [];
      $('.entry-link').each((idx, value) => {
        let entry = $(value).attr('href');
        array.push(entry);
      });
      return cb(null, array);
    });
  }

  getHotentry(category, cb) {
    let options = {
      url: `http://b.hatena.ne.jp/entrylist/${category}.rss?sort=hot`,
      headers: {
        "User-Agent": UA
      }
    }
    return request(options, (err, response, body) => {
      if (err) {
        return cb(err);
      }
      parser.parseString(body, (err, data) => {
        if (err) {
          return cb(err);
        }
        if (response.statusCode !== 200) {
          return cb(new Error("URL StatusCode is not 200."));
        }
        let entrys = []
        let items = data["rdf:RDF"].item
        items.forEach((item) => {
          //remove html-tags
          let description = item.description[0];
          if (description) {
            description = description.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
          }
          entrys.push({
            link: item.link[0],
            title: item.title[0],
            description: description,
            bookmark: item["hatena:bookmarkcount"][0]
          });
        });
        return cb(null, entrys);
      });
    });
  }

  getBookmarkInfo(url, cb) {
    let options = {
      url: `http://b.hatena.ne.jp/entry/json/${url}`,
      headers: {
        "User-Agent": UA
      }
    }
    return request(options, (err, response, body) => {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200) {
        return cb(new Error("URL StatusCode is not 200."));
      }
      return cb(null, body);
    });
  }

  // ブクマ数を調べる 0の場合はnullが返るらしい
  getBookmarkCount(url, cb) {
    const _url = `http://api.b.st-hatena.com/entry.count?url=${url}`;
    return request(_url, (err, response, body) => {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200) {
        return cb(new Error("URL StatusCode is not 200."));
      }
      if (typeof body === "undefined" && body === null) {
        body = 0
      }
      return cb(null, body);
    });
  }

  // output array
  // お気に入りに登録したURLとdateを配列を返す
  // offsetは20件単位で指定
  getBookmarkerLinkList(name, offset, cb) {
    if (typeof name === "undefined") {
      return cb(new Error("Bookmarker Name is undefined."));
    }
    return this.getBookmarkerRSS(name, offset, (err, result) => {
      if (err) {
        return cb(err);
      }
      parser.parseString(result, (err, data) => {
        if (err) {
          return cb(err);
        }
        if (typeof data["rdf:RDF"] === "undefined" && data["rdf:RDF"] === null) {
          return cb(new Error("Not data[rdf:RDF]"));
        }
        let items = data["rdf:RDF"].item
        let links = []
        items.forEach((item) => {
          links.push({
            url: item["link"][0],
            date: item["dc:date"][0]
          });
        });
        return cb(null, links);
      });
    });
  }

  getBookmarkerRSS(name, offset, cb) {
    let options = {
      url: `http://b.hatena.ne.jp/${name}/rss?of=${offset}`,
      headers: {
        "User-Agent": UA
      }
    }
    return request(options, (err, response, body) => {
      if (err) {
        return cb(err);
      }
      if (response.statusCode !== 200) {
        return cb(new Error("URL StatusCode is not 200."));
      }
      return cb(null, body);
    });
  }
}

module.exports = new HatebuClient()