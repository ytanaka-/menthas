const express = require("express")
const Channel = require("../model/channel")
const Category = require("../model/category")
const Page = require("../model/page")
const router = express.Router();
const config = require('config')
const CURATED_THRESHOLD = config.curated_threshold;
const TOP_CURATED_THRESHOLD = config.top_threshold;
const RSS_SIZE = 25;
const RSS = require("rss");

router.get('/', (req, res) => {
  res.render("index", {});
});

router.get('/:channel', (req, res) => {
  res.render("index", {});
});

// 後方互換として残しておく
router.get('/top/rss', (req, res) => {
  res.redirect('/all/rss');
});

router.get('/:channel/rss', (req, res) => {
  const channelName = req.params.channel;
  if(!channelName){
    return res.sendStatus(400);
  }
  Channel.findByName(channelName)
  .then((channel) => {
    if(channel == null){
      throw "Not found";
    }
    if(channel.name == "all"){
      return Page.findCuratedNews(TOP_CURATED_THRESHOLD, RSS_SIZE)
    }
    return Page.findCuratedNewsByCategory(channel.categories, CURATED_THRESHOLD, RSS_SIZE)
  }).then((pages)=>{
    const feed = new RSS({
      title: `Menthas #${channelName}`,
      description: 'Curated News Reader For Hackers.',
      feed_url: `http://menthas.com/${channelName}/rss`,
      site_url: 'http://menthas.com',
      custom_namespaces: {
        media: 'http://search.yahoo.com/mrss/'
      }
    });
    pages.forEach((page) => {
      const p = {
        title: page.title,
        description: page.description,
        url: page.url,
        date: page.curated_at
      }
      if (page.thumbnail) {
        p.custom_elements = [{
          media: {
            thumbnail: { _attr: { url: page.thumbnail } }
          }
        }]
      }
      feed.item(p);
    });
  
    res.set('Content-Type', 'text/xml')
    return res.send(feed.xml());
  }).catch((err)=>{
    if(err == "Not found"){
      return res.sendStatus(404)
    }
    console.error(err);
    return res.sendStatus(500);
  });
});

module.exports = router