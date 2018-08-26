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
        const selectionIndexes = this._diversifiedSelect(pages, size)
        console.log(selectionIndexes)
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
        const topSelectionIndexes = this._topSelect(pages, channelName)
        const selectionIndexes = this._newsSelect(pages, topSelectionIndexes, size)
        selectionIndexes.forEach((index)=>{
          _pages.push(pages[index])
        })
        resolve(_pages)
      }).catch((err)=>{
        reject(err);
      })
    })
  }

  _topSelect(pages, channelName){
    const selectionIndexes = []
    const now = moment()
    pages.some((page, i) => {
      const scores = page.scores
      const curatedTime = moment(page.curated_at)
      const diff = now.diff(curatedTime, 'hours')
      scores.forEach((score) => {
        // 1. 新着20件のうちscoreが対象カテゴリで4以上のものを探索かつ12時間以内のもの
        // 2. 足りなかったら新着順に入れる
        if ((score.category.name == channelName || channelName == "all") && score.score >= 4  
          && i < 20 && selectionIndexes.length < 3 ) {
          if (!selectionIndexes.includes(i)){
            selectionIndexes.push(i)
          }
        }
      })
      if(selectionIndexes.length > 3) {
        return true
      }
    })
    return selectionIndexes;
  }

  // 指定された件数までMMRを使ってindexを登録していく
  _diversifiedSelect(pages, size) {
    const selectedIndexes = []
    const now = moment()
    for (let i = 0; i < size; i++) {
      const max = {}
      pages.forEach((page, index) => {
        const scores = page.scores
        const hostName = page.host_name
        const category = {}
        const curatedTime = moment(page.curated_at)
        const diff = now.diff(curatedTime, 'hours')
        scores.forEach((score) => {
          if (!category.score || score.score > category.score) {
            category.score = score.score
            category.name = score.category.name
            category.curator = score.curated_by
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

  // 既に選出されている記事のindexを先頭にしながら並べる
  _newsSelect(pages, selectedIndexes, size){
    pages.some((page, i) => {
      if (!selectedIndexes.includes(i)){
        selectedIndexes.push(i)
      }
      if(selectedIndexes.length >= size) {
        return true
      }
    })
    return selectedIndexes
  }
}

module.exports = new PageService()
