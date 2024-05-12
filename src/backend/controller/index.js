const express = require("express");
const Channel = require("../model/channel");
const Category = require("../model/category");
const PageService = require("../model/page-service");
const router = express.Router();
const config = require("config");
const CURATED_THRESHOLD = config.curated_threshold;
const TOP_CURATED_THRESHOLD = config.top_threshold;
const RSS_SIZE = config.rss_size;
const RSS = require("rss");

router.get("/", (req, res) => {
  res.render("index", {});
});

router.get("/:channel", (req, res) => {
  const channelName = req.params.channel;
  res.render("index", { channel: channelName });
});

// 後方互換として残しておく
router.get("/top/rss", (req, res) => {
  res.redirect("/all/rss");
});

router.get("/:channel/rss", (req, res) => {
  const channelName = req.params.channel;
  if (!channelName) {
    return res.sendStatus(400);
  }
  Channel.findByName(channelName)
    .then((channel) => {
      if (channel == null) {
        throw "Not found";
      }
      if (channel.name == "all") {
        return PageService.curatedNewsSelect(TOP_CURATED_THRESHOLD, RSS_SIZE);
      }
      return PageService.curatedNewsSelectByCategory(
        channel.name,
        channel.categories,
        CURATED_THRESHOLD,
        RSS_SIZE,
      );
    })
    .then((pages) => {
      const feed = new RSS({
        title: `Menthas #${channelName}`,
        description: "Menthas: Curated News Reader For Hackers.",
        feed_url: `https://menthas.com/${channelName}/rss`,
        site_url: "https://menthas.com",
        custom_namespaces: {
          media: "https://search.yahoo.com/mrss/",
        },
      });
      pages.forEach((page) => {
        let title = String(page.title);
        let description = String(page.description);
        // RSSに制御文字が含まれているとエラーになるので、W3Cに従ってタブ/キャリッジリターン/ラインフィード以外は削除
        title = title.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
        description = description.replace(
          /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g,
          "",
        );
        const p = {
          title: title,
          description: description,
          url: page.url,
          date: page.curated_at,
        };
        if (page.thumbnail) {
          p.custom_elements = [
            {
              media: {
                thumbnail: { _attr: { url: page.thumbnail } },
              },
            },
          ];
        }
        feed.item(p);
      });

      res.set("Content-Type", "text/xml");
      return res.send(feed.xml());
    })
    .catch((err) => {
      if (err == "Not found") {
        return res.sendStatus(404);
      }
      console.error(err);
      return res.sendStatus(500);
    });
});

module.exports = router;
