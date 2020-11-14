const path = require('path');
const fetch = require('node-fetch');
const kuromoji = require("kuromoji");
const dictPath = path.join(__dirname, '../../../dict');
// 類似度を返すpythonサーバのエンドポイント
const ENDPOINT = "http://localhost:5000";

class ContentsClient {

  async build() {
    this.tokenizer = await this.buildKuromoji(dictPath);
  }

  async fetchSimilarity(category, features) {
    let featuresStr = features.toString();
    featuresStr = encodeURIComponent(featuresStr);
    const response = await fetch(`${ENDPOINT}/api/similarity?category=${category}&features=${featuresStr}`);
    const result = await response.json();
    return result.similarity;
  }

  getFeatures(str) {
    const tokens = this.tokenizer.tokenize(str);
    return this.extractTokenizedFeatures(tokens);
  }

  buildKuromoji(dicPath) {
    return new Promise((resolve, reject) => {
      kuromoji.builder({ dicPath }).build((err, tokenizer) => {
        if (err) {
          reject(err);
        } else {
          resolve(tokenizer);
        }
      });
    });
  }

  // 固有名詞とサ変接続の中で基本形があるものを抽出する
  // 左辺接続は記号を含んでしまうので基本形をみている
  extractTokenizedFeatures(tokens) {
    const features = []
    for (const token of tokens) {
      if (token.pos_detail_1 === "固有名詞") {
        if (token.surface_form.length > 1) {
          features.push(token.surface_form);
        }
      }
      if (token.pos_detail_1 === "サ変接続") {
        if (token.surface_form.length > 1 && token.basic_form !== "*") {
          features.push(token.surface_form);
        }
      }
    }
    return features;
  }

}

module.exports = new ContentsClient();