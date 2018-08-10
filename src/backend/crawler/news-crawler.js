const hatebuClient = require("./hatebu-client")
const webpageClient = require("./webpage-client")
const Category = require("../model/category")
const Page = require("../model/page")
const CURATE_THRESHOLD = 3
const MAX_THRESHOLD = 5

class NewsCrawler {

  async checkCategory(categoryName) {
    try {
      const category = await Category.findByName(categoryName);
      for(const curator of category.curators){
        await this.checkCurator(curator, category);
        await this.sleep(1000);
      }
    } catch (err){
      console.error(err);
    }
    console.log(`CheckCategory[${categoryName}] is completed.`)
  }

  async checkCurator(curator, category) {
    console.log(`CheckCurator[${curator}] is starting.`);
    const links = await this.fetchCuratorRSS(curator);
    for(const link of links){
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
      } catch (err){
        console.error(err);
      }
    }
    console.log(`CheckCurator[${curator}] is completed.`);
  }

  sleep(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }

  fetchCuratorRSS(curator) {
    return new Promise((resolve, reject) => {
      hatebuClient.getBookmarkerLinkList(curator, 0, (err, links) => {
        if (err) {
          console.error(err);
          return reject(err);
        }
        resolve(links);
      });
    });
  }

  fetchWebPageAndUpdateScore(url, curator, category) {
    return new Promise((resolve, reject) => {
      Page.findByUrl(url)
        .then((page) => {
          if (!page) {
            return this.registerPage(url, curator, category);
          }
          return this.updateScore(page, curator, category);
        }).then((message) => {
          resolve(message);
        }).catch((err) => {
          reject(err);
        });
    });
  }

  updateScore(page, curator, category) {
    return new Promise((resolve, reject) => {
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
          // scoreがCURATE_THRESHOLD以上かつ、対象のpageの最大scoreがMAX_THRESHOLD未満の場合
          if (updateScores[i].score >= CURATE_THRESHOLD && updateScores[i].score <= MAX_THRESHOLD) {
            isUpdatedCuratedTime = true;
          } else if (updateScores[i].score > MAX_THRESHOLD){
            isUpdatedCuratedTime = false;
          }
        }
      });
      if (isUpdatedCuratedTime){
        curated_at = Date.now();
      }
      if (isAlreadyCurated) {
        return resolve("already curated.");
      } else if (!isCuratedInCategory) {
        // 対象CuratorがまだCategoryのScoreに登録されていない場合
        let _score = 1;
        const _str = page.title + ":" + page.description
        if (category.tags.some((tag) => { return !!~_str.indexOf(tag) }) == true) {
          _score = _score + 2;
        }
        updateScores.push({
          category: category._id,
          score: _score,
          curated_by: [curator]
        })
      }
      Page.findOneAndUpdate({ _id: page._id }, { scores: updateScores, curated_at: curated_at })
        .then(() => resolve("updated."))
        .catch((err) => {
          if(err.code == 11000){
            return resolve("already exists.");
          }
          reject(err);
        })
    });
  }

  registerPage(url, curator, category) {
    return new Promise((resolve, reject) => {
      webpageClient.fetch(url)
        .then((page) => {
          let _score = 1;
          const _str = page.title + ":" + page.description
          // indexOfが値が存在しない場合に-1を返すのを利用
          if (category.tags.some((tag) => { return !!~_str.indexOf(tag) }) == true) {
            _score = _score + 2;
          }

          const newPage = new Page({
            url: page.url,
            title: page.title,
            description: page.description,
            thumbnail: page.thumbnail,
            host_name: page.host_name,
            amphtml: page.amphtml,
            scores: [{
              category: category._id,
              score: _score,
              curated_by: [curator]
            }]
          })
          
          return newPage.save();
        }).then(() => {
          resolve("new page is registered.");
        }).catch((err) => {
          if(err.code == 11000){
            return resolve("already exists.");
          }
          reject(err);
        });
    });
  }

}

module.exports = new NewsCrawler()