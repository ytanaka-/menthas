const client = require("cheerio-httpcli")
const validator = require('validator')

// 最大受信量を2MBに制限
client.set('maxDataSize', 1024 * 1024 * 2);

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
          title: $("title").text()
        }
        // canonical属性がある場合はそのURLを優先して二重登録を防ぐ
        const canonial = $("link[rel='canonical']").attr('href');
        if (canonial) {
          page.url = canonial;
        }
        if (!validator.isURL(page.url, { protocols: ['http','https']})) {
          return reject(new Error("Failed to validate URL."));
        }
        
        // og:titleがある場合はそちらを優先
        const ogTitle = $("meta[property='og:title']").attr("content");
        if (typeof ogTitle !== "undefined" && ogTitle !== "") {
          page.title = ogTitle;
        }
        if (typeof page.title === "undefined" || page.title === "") {
          return reject(new Error("Page title is empty."));
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

        const description = $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content");
        page.description = description

        // AMP対応していれば対象URLを取得
        page.amphtml = $("link[rel='amphtml']").attr('href');

        resolve(page);
      });
    })
  }

}

module.exports = new WebPageClient()