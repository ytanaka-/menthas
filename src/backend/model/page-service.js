const Page = require("./page")
const moment = require('moment')
const config = require('config')
const SELECTION_SIZE = config.selection_size
const MMR_REL_WEIGHT = 0.75

class PageService {

  curatedNewsSelect(threshold, size){
    const _pages = []
    return new Promise((resolve, reject) => {
      Page.findCuratedNews(threshold, SELECTION_SIZE)
      .then((pages)=>{
        const selectionIndexes = this._diversifiedSelect(pages, size, ["all"])
        selectionIndexes.forEach((index)=>{
          _pages.push(pages[index])
        })
        resolve(_pages)
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  curatedNewsSelectByCategory(channelName, categories, threshold, size){
    const _pages = []
    return new Promise((resolve, reject) => {
      Page.findCuratedNewsByCategory(categories, threshold, SELECTION_SIZE)
      .then((pages)=>{
        const selectionIndexes = this._diversifiedSelect(pages, size, categories)
        selectionIndexes.forEach((index)=>{
          _pages.push(pages[index])
        })
        resolve(_pages)
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  // 指定された件数までMMRを使ってindexを登録していく
  _diversifiedSelect(pages, size, categories) {
    const selectedIndexes = []
    const now = moment()
    // categoriesはmongooseのidの配列なので文字列にする
    const _categories = []
    categories.forEach((category)=>{
      _categories.push(category.toString())
    })
    for (let i = 0; i < size; i++) {
      const max = {}
      pages.forEach((page, index) => {
        const scores = page.scores
        const hostName = page.host_name
        const curatedTime = moment(page.curated_at)
        const diff = now.diff(curatedTime, 'hours')
        const category = {}
        scores.forEach((score) => {
          if (_categories == "all" || (_categories && _categories.includes(score.category._id.toString()))){
            if (!category.score || score.score > category.score) {
              category.score = score.score
              category.name = score.category.name
              category.curator = score.curated_by
            }
          }
        })
        if (category.score > 5) {
          category.score = 5
        }
        // 時間経過からrelを算出
        const rel = category.score / ((diff + 2) ^ 1.5)
        // hostやcategory, curatorから類似度を算出
        const sim = 0
        const mmrScore = MMR_REL_WEIGHT * rel + (1 - MMR_REL_WEIGHT) * sim
        if (!selectedIndexes.includes(index) && (max.index == undefined || mmrScore > max.score)) {
          max.index = index
          max.score = mmrScore
        }
      })
      selectedIndexes.push(max.index)
    }
    return selectedIndexes
  }

}

module.exports = new PageService()
