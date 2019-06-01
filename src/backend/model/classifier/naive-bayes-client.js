const NaiveBayes = require('bayes')
const Store = require("./store")

class NaiveBayesClient {

  constructor(){
    this.loadClassifer()
  }

  async loadClassifer() {
    const doc = await Store.findOne({name: "naive-bayes-state"}).exec()
    this.classifier = NaiveBayes.fromJson(doc.state)
    this.classifier.tokenizer = function (array) { return array }
  }

  filteringNews(pages) {
    const list = []
    pages.forEach((page) => {
      let isPassed = false
      const hostName = page.host_name
      const scores = page.scores
      scores.forEach((score) => {
        const features = [hostName]
        features.push(score.category.name)
        features.push(score.curated_by)
        // いずれかのcategoryが1なら通過としておく
        const result = this.classifier.categorize(features)
        if (result == 1) {
          isPassed = true
        }
      })

      if (isPassed) {
        list.push(page)
      }
    })

    return list
  }

}

module.exports = new NaiveBayesClient()