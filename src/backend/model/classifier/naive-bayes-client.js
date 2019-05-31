const NaiveBayes = require('bayes')
const stateJson = require('./nb-classifier.json')
const classifier = NaiveBayes.fromJson(JSON.stringify(stateJson))
classifier.tokenizer = function (array) { return array }

class NaiveBayesClient {

  filteringNews(pages) {
    const list = []
    pages.forEach((page) => {
      let isPickuped = false
      const hostName = page.host_name
      const scores = page.scores
      scores.forEach((score) => {
        const features = [hostName]
        features.push(score.category.name)
        features.push(score.curated_by)
        // いずれかのcategoryが1なら通過としておく
        const result = classifier.categorize(features)
        if (result == 1) {
          isPickuped = true
        }
      })

      if (isPickuped) {
        list.push(page)
      }
    })

    return list
  }

}

module.exports = new NaiveBayesClient()