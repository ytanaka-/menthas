const nock = require('nock');
const contentsClient = require("../contents-client");
const ENDPOINT = "http://localhost:5000";

describe('unit test', () => {
  beforeAll(async () => {
    await contentsClient.build();
  });

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
      {
        word_id: 1,
        word_type: 'UNKNOWN',
        word_position: 1,
        surface_form: 'Test',
        pos: '名詞',
        pos_detail_1: '固有名詞',
        pos_detail_2: '組織',
        pos_detail_3: '*',
        conjugated_type: '*',
        conjugated_form: '*',
        basic_form: '*'
      },
      {
        word_id: 2,
        word_type: 'KNOWN',
        word_position: 2,
        surface_form: ' ',
        pos: '記号',
        pos_detail_1: '一般',
        pos_detail_2: '*',
        pos_detail_3: '*',
        conjugated_type: '*',
        conjugated_form: '*',
        basic_form: ' '
      },
      {
        word_id: 3,
        word_type: 'UNKNOWN',
        word_position: 3,
        surface_form: '処理',
        pos: '名詞',
        pos_detail_1: 'サ変接続',
        pos_detail_2: '*',
        pos_detail_3: '*',
        conjugated_type: '*',
        conjugated_form: '*',
        basic_form: '処理'
      }
    ]
    const result = contentsClient.extractTokenizedFeatures(_tokens);
    expect(result).toEqual(["Test", "処理"]);
  });

});