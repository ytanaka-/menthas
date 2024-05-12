const nock = require("nock");
const hatebuClient = require("../hatebu-client");
const BASE_URL = "https://b.hatena.ne.jp/";

describe("unit test", () => {
  const mockRes = `<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
    <item>
    <title>test</title>
    <link>http://example.com/</link>
    <dc:date>2024-01-00T00:00:00Z</dc:date>
    </item>
  </rdf:RDF>`;
  beforeEach(() => {
    nock(`${BASE_URL}`).get("/test/bookmark.rss?of=0").reply(200, mockRes);
  });

  it("getBookmarkerLinkList: urlとdateを抜き出せる", async () => {
    const result = await hatebuClient.getBookmarkerLinkList("test", 0);
    expect(result).toEqual([
      { date: "2024-01-00T00:00:00Z", url: "http://example.com/" },
    ]);
  });
});
