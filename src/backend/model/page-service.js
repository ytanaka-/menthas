const Page = require("./page")
const moment = require('moment')
const config = require('config')
const SELECTION_SIZE = config.selection_size
const MMR_REL_WEIGHT = config.mmr_rel_weight

class PageService {

  curatedNewsSelect(threshold, size){
    return new Promise((resolve, reject) => {
      Page.findCuratedNews(threshold, SELECTION_SIZE)
      .then((pages)=>{
        const selectionPages = this._diversifiedSelect(pages, size, ["all"])
        resolve(selectionPages)
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  curatedNewsSelectByCategory(channelName, categories, threshold, size){
    return new Promise((resolve, reject) => {
      Page.findCuratedNewsByCategory(categories, threshold, SELECTION_SIZE)
      .then((pages)=>{
        const selectionPages = this._diversifiedSelect(pages, size, categories)
        resolve(selectionPages)
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  // 指定された件数までMMRを使ってindexを登録していく
  _diversifiedSelect(pages, size, categories) {
    const selectedPages = []
    const selectedPageUnions = []
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
        // 類似度計測用に使う要素
        const union = [hostName, category.name].concat(category.curator)
        if (category.score > 5) {
          category.score = 5
        }
        // 時間経過からrelを算出
        const rel = category.score / ((diff + 2) ^ 1.5)
        // 類似度を算出
        const sim = this._maxSim(union, selectedPageUnions)
        const mmrScore = MMR_REL_WEIGHT * rel - (1 - MMR_REL_WEIGHT) * sim
        if (max.index == undefined || mmrScore > max.score) {
          max.index = index
          max.score = mmrScore
          max.union = union
        }
      })
      selectedPages.push(pages[max.index])
      selectedPageUnions.push(max.union)
      pages.splice(max.index, 1)
    }
    return selectedPages
  }

  _maxSim(union, selectedUnions){
    let max = 0
    selectedUnions.forEach((_union) => {
      let intersection = 0
      union.forEach((u1)=>{
        _union.forEach((u2)=>{
          if(u1 == u2) {
            intersection++
          }
        })
      })
      const sim = intersection / (union.length + _union.length - intersection)
      if(sim > max){
        max = sim
      }
    })
    return max
  }

}

module.exports = new PageService()
