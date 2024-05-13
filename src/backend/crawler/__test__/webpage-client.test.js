const nock = require("nock");
const webpageClient = require("../webpage-client");
const BASE_URL = "http://test.menthas.com/";

describe("unit test", () => {
  const mock =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta property="og:title" content="test"><meta property="og:image" content="http://test.menthas.com/thumbnail.png"><meta property="og:description" content="test"><title>notitle</title></head><body></body></html>';
  const noTitle =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta property="og:title" content="notitle"><meta property="og:description" content="test"></head><body></body></html>';
  const canonicalMock =
    '<!DOCTYPE html><html><head><meta charset="utf-8"><meta property="og:title" content="canonical"><title>canonical</title><link rel="canonical" href="http://canonical.url"></head><body></body></html>';

  beforeAll(() => {
    nock(`${BASE_URL}`).get("/").reply(200, mock);
    nock(`${BASE_URL}`).get("/notitle").reply(200, noTitle);
    nock(`${BASE_URL}`).get("/canonical").reply(200, canonicalMock);
  });

  it("titleとog:imageをmetaタグから抽出できる", async () => {
    const result = await webpageClient.fetch(BASE_URL);
    expect(result.url).toBe(BASE_URL);
    expect(result.title).toBe("test");
    expect(result.description).toBe("test");
    expect(result.thumbnail).toBe("http://test.menthas.com/thumbnail.png");
  });

  it("og:titleとog:imageをmetaタグから抽出できる", async () => {
    const result = await webpageClient.fetch(BASE_URL + "notitle");
    expect(result.title).toBe("notitle");
  });

  it("canonicalがある場合にurlを置き換える", async () => {
    const result = await webpageClient.fetch(BASE_URL + "canonical");
    expect(result.title).toBe("canonical");
    expect(result.url).toBe("http://canonical.url");
  });
});
