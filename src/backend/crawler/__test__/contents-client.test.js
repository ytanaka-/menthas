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
    const _str = "Node.js\nJavaScriptについて";
    const result = contentsClient.getFeatures(_str);
    expect(result).toEqual(["Node.js", "JavaScript"]);
  });

  it("extractTokenizedFeatures", () => {
    const _tokens = [
      ['Test', '名詞', '固有名詞', '組織', '*', '*', '*', '*'],
      [
        '処理', '名詞',
        'サ変接続', '*',
        '*', '*',
        '*', '処理',
        'ショリ', 'ショリ'
      ], ['EOS']
    ]
    const result = contentsClient.extractTokenizedFeatures(_tokens);
    expect(result).toEqual(["Test", "処理"]);
  });

});