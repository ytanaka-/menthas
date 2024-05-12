const fetch = require("node-fetch");
const TinySegmenter = require("tiny-segmenter");
// 類似度を返すpythonサーバのエンドポイント
const ENDPOINT = "http://localhost:5000";

class ContentsClient {
  constructor() {
    this.segmenter = new TinySegmenter();
  }

  async fetchSimilarity(category, features) {
    let featuresStr = features.toString();
    if (!featuresStr) {
      featuresStr = "[]";
    }
    featuresStr = encodeURIComponent(featuresStr);
    const response = await fetch(
      `${ENDPOINT}/api/similarity?category=${category}&features=${featuresStr}`,
    );
    const result = await response.json();
    return result.similarity;
  }

  getFeatures(str) {
    const segments = this.segmenter.segment(str);
    return this.extractFeatureSegments(segments);
  }

  extractFeatureSegments(segments) {
    const hiragana = new RegExp(/^[ぁ-んー　]*$/);
    const features = [];
    segments.forEach((segment) => {
      if (segment.length < 2) {
        return;
      }
      // 全てひらがなの場合は助詞などとみなして登録しない
      if (hiragana.test(segment)) {
        return;
      }
      features.push(segment);
    });
    return features;
  }
}

module.exports = new ContentsClient();
