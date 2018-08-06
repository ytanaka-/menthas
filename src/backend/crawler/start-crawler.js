const mongoose = require('mongoose')
const config = require('../../../config')
const crawler = require("./news-crawler")
const Category = require("../model/category")

mongoose.connect(config.mongo.URL)

const category = process.argv[2]

if (category) {
  (async () => {
    await crawler.checkCategory(category);
    mongoose.disconnect();
  })();
} else {
  // categoryの指定がない場合は全categoryを対象にする
  (async () => {
    const categories = await Category.findAll();
    for (const category of categories) {
      await crawler.checkCategory(category.name);
    }
    mongoose.disconnect();
  })();
}