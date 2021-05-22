const nock = require('nock');
const contentsClient = require("../contents-client");
const ENDPOINT = "http://localhost:5000";

describe('unit test', () => {

  beforeEach(() => {
    nock(`${ENDPOINT}`)
      .get('/api/similarity')
      .query({ category: 'javascript', features: 'JavaScript,Node.js' })
      .reply(200, {
        category: 'javascript',
        similarity: 1.0
      });
  });

  it("fetchSimilarity", async () => {
    const feat = ["JavaScript", "Node.js"];
    const result = await contentsClient.fetchSimilarity("javascript", feat);
    expect(result).toBe(1);
  });

  it("getFeatures", () => {
    const _str = "TypeScriptとJavaScriptについて";
    const result = contentsClient.getFeatures(_str);
    expect(result).toEqual(["TypeScript", "JavaScript"]);
  });

  it("extractFeatureSegments", () => {
    const _tokens = ["これ","は","test","の","テスト","です","。"];
    const result = contentsClient.extractFeatureSegments(_tokens);
    expect(result).toEqual(["test", "テスト"]);
  });

  it("segmenter", () => {
    const _str = "これはtestのテストです。文字列を分かち書きできるか判定します。";
    const segs = contentsClient.getFeatures(_str);
    const result = contentsClient.extractFeatureSegments(segs);
    expect(result).toEqual(["test", "テスト", "文字列", "分かち", "書き", "判定"]);
  });

});