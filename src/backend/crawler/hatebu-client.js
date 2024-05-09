const fetch = require('node-fetch');
const xml2js = require("xml2js");
const config = require("config");
const parser = new xml2js.Parser();
const UA = config.crawler.UA;

class HatebuClient {

  // output array
  // お気に入りに登録したURLとdateを配列を返す
  // offsetは20件単位で指定
  async getBookmarkerLinkList(name, offset) {
    if (typeof name === "undefined") {
      throw new Error("Bookmarker Name is undefined.");
    }
    const result = await this.getBookmarkerRSS(name, offset).catch((err) => { throw err; });
    const data = await parser.parseStringPromise(result);  
    if (typeof data["rdf:RDF"] === "undefined" && data["rdf:RDF"] === null) {
      throw new Error("Not data[rdf:RDF]");
    }
    const items = data["rdf:RDF"].item;
    const links = [];
    items.forEach((item) => {
      links.push({
        url: item["link"][0],
        date: item["dc:date"][0]
      });
    });
    return links;
  }

  async getBookmarkerRSS(name, offset) {
    const url = `https://b.hatena.ne.jp/${name}/bookmark.rss?of=${offset}`;
    const options = {
      headers: {
        "User-Agent": UA
      }
    }
    const res = await fetch(url, options);
    if (res.status !== 200) {
      throw new Error("URL StatusCode is not 200.");
    }
    return await res.text();
  }
}

module.exports = new HatebuClient()