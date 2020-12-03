const hatebuClient = require("./hatebu-client")
const webpageClient = require("./webpage-client")
const contentsClient = require("./contents-client")
const Category = require("../model/category")
const Page = require("../model/page")
const config = require('config')
const CONTENTS_SCORE_WEIGHT = config.contents_score_weight
const SIMILARITY_SCORE_WEIGHT = config.similarity_score_weight
const CURATE_THRESHOLD = 3
const MAX_THRESHOLD = 4

class NewsCrawler {

  async checkCategory(categoryName) {
    try {
      const category = await Category.findByName(categoryName);
      // curatorのlistは先頭がscoreが高いので逆順にする
      const curators = category.curators.reverse();
      for (const curator of curators) {
        await this.checkCurator(curator, category);
        await this.sleep(1000);
      }
    } catch (err) {
      console.error(err);
    }
    console.log(`CheckCategory[${categoryName}] complete.`)
  }

  async checkCurator(curator, category) {
    console.log(`CheckCurator[${curator}] is starting.`);
    const links = await this.fetchCuratorRecentRSS(curator);
    for (const link of links) {
      try {
        const message = await this.fetchWebPageAndUpdateScore(link.url, curator, category);
        if (message) {
          console.log(message);
          // 既に登録済みのところまできたら探索を打ち切る
          if (message == "already curated.") {
            break;
          }
        }
        await this.sleep(300);
      } catch (err) {
        console.error(err);
      }
    }
    console.log(`CheckCurator[${curator}] complete.`);
  }

  sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  fetchCuratorRecentRSS(curator) {
    return new Promise((resolve, reject) => {
      hatebuClient.getBookmarkerLinkList(curator, 0, (err, links) => {
        if (err) {
          return reject(err);
        }
        const recentLinks = [];
        const now = new Date();
        // 1日以上古いブクマは対象外とする
        for (const link of links) {
          const diff = (now - new Date(link.date)) / (1000 * 60 * 60 * 24);
          if (diff < 1) {
            recentLinks.push(link);
          }
        }
        resolve(recentLinks);
      });
    });
  }

  async fetchWebPageAndUpdateScore(url, curator, category) {
    const page = await Page.findByUrl(url);
    if (!page) {
      return await this.registerPage(url, curator, category);
    } else {
      return await this.updateScore(page, curator, category);
    }
  }

  async updateScore(page, curator, category) {
    try {
      let updateScores = page.scores;
      let curated_at = page.curated_at;
      let isAlreadyCurated = false;
      let isCuratedInCategory = false;
      let isUpdatedCuratedTime = false;
      updateScores.some((__score, i) => {
        if (__score.category.equals(category._id.toString())) {
          if (__score.curated_by.includes(curator)) {
            isAlreadyCurated = true;
            return true;
          }
          isCuratedInCategory = true;
          updateScores[i].curated_by.push(curator);
          updateScores[i].score = updateScores[i].score + 1;
          // scoreが一定条件を満たすときはcurated_atを更新
          // 一旦curated_atは更新しないようにする(2018/08)
          // 複数人がcurateしたときは既にbuzzっている可能性が高いし、scoreが上がればtopに表示されやすくなるので
          // わざわざ更新して上位にあげる必要性がない
          /*
          if (updateScores[i].score >= CURATE_THRESHOLD) {
            isUpdatedCuratedTime = true;
          } else if (updateScores[i].score >= MAX_THRESHOLD){
            isUpdatedCuratedTime = false;
          }*/
        }
      });
      if (isUpdatedCuratedTime) {
        curated_at = Date.now();
      }
      if (isAlreadyCurated) {
        return "already curated.";
      } else if (!isCuratedInCategory) {
        // 対象CuratorがまだCategoryのScoreに登録されていない場合
        let _score = 1;
        const _str = page.title + "\n" + page.description;
        const features = contentsClient.getFeatures(_str);
        const similarity = await contentsClient.fetchSimilarity(category.name, features);
        if (similarity != 0.0) {
          _score = _score + SIMILARITY_SCORE_WEIGHT * Math.tanh(4 * similarity - 1.25); // tanhで調整
        }
        // indexOfが値が存在しない場合に-1を返すのを利用
        if (category.tags.some((tag) => { return !!~_str.indexOf(tag) }) == true) {
          _score = _score + CONTENTS_SCORE_WEIGHT * 1;
        }
        updateScores.push({
          category: category._id,
          score: _score,
          curated_by: [curator]
        });
      }
      await Page.findOneAndUpdate({ _id: page._id }, { scores: updateScores, curated_at: curated_at });
      return "updated.";
    } catch (err) {
      if (err.code == 11000) {
        return "already exists.";
      }
      throw err;
    };
  }

  async registerPage(url, curator, category) {
    try {
      const page = await webpageClient.fetch(url);
      let _score = 1;
      const _str = page.title + "\n" + page.description;
      const features = contentsClient.getFeatures(_str);
      const similarity = await contentsClient.fetchSimilarity(category.name, features);
      if (similarity != 0.0) {
        _score = _score + SIMILARITY_SCORE_WEIGHT * Math.tanh(4 * similarity - 1.25);
      }
      if (category.tags.some((tag) => { return !!~_str.indexOf(tag) }) == true) {
        _score = _score + CONTENTS_SCORE_WEIGHT * 1;
      }
      const newPage = new Page({
        url: page.url,
        title: page.title,
        description: page.description,
        thumbnail: page.thumbnail,
        host_name: page.host_name,
        amphtml: page.amphtml,
        features: features,
        scores: [{
          category: category._id,
          score: _score,
          curated_by: [curator]
        }]
      });
      await newPage.save();
      return "new page is registered.";
    } catch (err) {
      if (err.code == 11000) {
        return "already exists.";
      }
      throw err;
    }
  }
}

module.exports = new NewsCrawler()