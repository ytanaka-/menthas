const express = require("express")
const Channel = require("../model/channel")
const Page = require("../model/page")
const router = express.Router();
const config = require('config')
const PAGE_SIZE = 30;
const CURATED_THRESHOLD = config.curated_threshold;
const TOP_CURATED_THRESHOLD = config.top_threshold;

router.get('/channels', (req, res) => {
  Channel.findAll()
  .then((channels) => {
    return res.json({
      channels: channels
    });
  }).catch((err)=>{
    console.error(err);
    return res.sendStatus(500);
  });
});

router.get('/channels/:name', (req, res) => {
  const name = req.params.name;
  if(!name){
    return res.sendStatus(400);
  }
  Channel.findByName(name)
  .then((channel) => {
    if(channel == null){
      throw "Not found";
    }
    if(channel.name == "all"){
      return Page.findCuratedNews(TOP_CURATED_THRESHOLD, PAGE_SIZE)
    }
    return Page.findCuratedNewsByCategory(channel.categories, CURATED_THRESHOLD, PAGE_SIZE)
  }).then((pages)=>{
    return res.json({
      pages: pages
    });
  }).catch((err)=>{
    if(err == "Not found"){
      return res.sendStatus(404)
    }
    console.error(err);
    return res.sendStatus(500);
  });
});


module.exports = router