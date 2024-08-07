const express = require("express");
const Channel = require("../model/channel");
const PageService = require("../model/page-service");
const router = express.Router();
const config = require("config");
const PAGE_SIZE = config.page_size;
const CURATED_THRESHOLD = config.curated_threshold;
const TOP_CURATED_THRESHOLD = config.top_threshold;

router.get("/channels", (req, res) => {
  Channel.findAll()
    .then((channels) => {
      return res.json({
        channels: channels,
      });
    })
    .catch((err) => {
      console.error(err);
      return res.sendStatus(500);
    });
});

router.get("/channels/:name", (req, res) => {
  const name = req.params.name;
  if (!name) {
    return res.sendStatus(400);
  }
  Channel.findByName(name)
    .then((channel) => {
      if (channel == null) {
        throw "Not found";
      }
      if (channel.name == "all") {
        return PageService.curatedNewsSelect(TOP_CURATED_THRESHOLD, PAGE_SIZE);
      }
      return PageService.curatedNewsSelectByCategory(
        channel.name,
        channel.categories,
        CURATED_THRESHOLD,
        PAGE_SIZE,
      );
    })
    .then((pages) => {
      const _pages = [];
      pages.forEach((page) => {
        const description = page.description;
        if (description && description.length > 300) {
          page.description = description.substr(0, 300);
        }
        _pages.push({
          _id: page._id,
          title: page.title,
          url: page.url,
          description: page.description,
          thumbnail: page.thumbnail,
          host_name: page.host_name,
          amphtml: page.amphtml,
          curated_at: page.curated_at,
          scores: page.scores.map((score) => {
            return {
              category: score.category,
              score: score.score,
            };
          }),
        });
      });
      return res.json({
        pages: _pages,
      });
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
