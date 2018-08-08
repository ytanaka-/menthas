const client = require("cheerio-httpcli")
const request = require("request")

// 最大受信量を10MBに制限
client.set('maxDataSize', 1024 * 1024 * 10);

class WebPageClient {

  // urlからpageのmetaデータを取得
  fetch(url) {
    return new Promise((resolve, reject) => {
      client.fetch(url, (err, $, res) => {
        if (err) {
          return reject(err);
        }
        // statusCodeが200でない場合はエラーを飛ばす
        if (res.statusCode !== 200) {
          return reject(new Error("URL StatusCode is not 200."));
        }
        // redirect後のurlを取得するためにres.request.hrefを使う
        // 短縮URLやリダイレクトされていると同じエントリが重複して生成されてしまう
        let page = {
          url: res.request.href,
          title: $("title").text(),
          redirected: false
        }
        if(url != res.request.href){
          page.redirected = true
        }
        if (typeof page.title === "undefined" || page.title === "") {
          return reject(new Error("Page title is empty."));
        }

        // og:titleがある場合はそちらを優先
        const ogTitle = $("meta[property='og:title']").attr("content");
        if (typeof ogTitle !== "undefined" && ogTitle !== "") {
          page.title = ogTitle;
        }

        page.thumbnail = $("meta[property='og:image']").attr("content");
        // urlが/hogeのようなlocalを前提にしたものの場合は削除
        if (/^\//.test(page.thumbnail)) {
          page.thumbnail = '';
        }

        page.host_name = $("meta[property='og:site_name']").attr("content");
        if (typeof page.host_name === "undefined" || page.host_name === "") {
          page.host_name = res.request.host;
        }

        let description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content");
        if (description) {
          description = description.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
        }
        page.description = description

        // AMP対応していれば対象URLを取得
        page.amphtml = $("link[rel='amphtml']").attr('href');

        resolve(page);
      });
    })
  }

}

module.exports = new WebPageClient()