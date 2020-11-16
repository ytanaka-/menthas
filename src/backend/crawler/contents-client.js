const fetch = require('node-fetch');
const Mecab = require('mecab-async');
// 類似度を返すpythonサーバのエンドポイント
const ENDPOINT = "http://localhost:5000";

class ContentsClient {

  constructor() {
    this.tokenizer = new Mecab();
  }

  async fetchSimilarity(category, features) {
    let featuresStr = features.toString();
    if (!featuresStr) {
      featuresStr = "[]";
    }
    featuresStr = encodeURIComponent(featuresStr);
    const response = await fetch(`${ENDPOINT}/api/similarity?category=${category}&features=${featuresStr}`);
    const result = await response.json();
    return result.similarity;
  }

  getFeatures(str) {
    const tokens = this.tokenizer.parseSync(str);
    return this.extractTokenizedFeatures(tokens);
  }

  // 固有名詞とサ変接続の中で基本形があるものを抽出する
  // 左辺接続は記号を含んでしまうので基本形をみている
  extractTokenizedFeatures(tokens) {
    const features = []
    tokens.forEach(token => {
      // ['EOS']が返る場合などがあるので標準形で返っているかチェックする
      if (token.length > 7) {
        const surface_form = token[0];
        const pos_detail_1 = token[2];
        const basic_form = token[7];
        if (pos_detail_1 === "固有名詞") {
          if (surface_form.length > 1) {
            features.push(surface_form);
          }
        }
        if (pos_detail_1 === "サ変接続") {
          if (surface_form.length > 1 && basic_form !== "*") {
            features.push(surface_form);
          }
        }
      }
    });
    return features;
  }
}

module.exports = new ContentsClient();