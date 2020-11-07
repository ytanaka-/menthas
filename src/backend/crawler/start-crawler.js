const mongoose = require('mongoose')
const config = require('config')
const crawler = require("./news-crawler")
const Category = require("../model/category")
const DB_NAME = process.env.MONGO_DB_NAME ||  config.mongo.DB_NAME;
mongoose.connect(process.env.MONGO_URL || config.mongo.URL, { dbName: DB_NAME, useNewUrlParser: true, useUnifiedTopology: true });

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
    // Crawlする順番に偏りがないようにシャッフル
    for (let i = categories.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [categories[i], categories[j]] = [categories[j], categories[i]];
    }
    for (const category of categories) {
      await crawler.checkCategory(category.name);
    }
    mongoose.disconnect();
  })();
}