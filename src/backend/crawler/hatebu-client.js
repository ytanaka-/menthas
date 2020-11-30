const request = require("request")
const xml2js = require("xml2js")
const config = require("config")
const parser = new xml2js.Parser();
const UA = config.crawler.UA

class HatebuClient {

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