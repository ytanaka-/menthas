const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
  category: {
    type: Schema.ObjectId,
    ref: "Category"
  },
  score: { 
    type: Number,
    default: 0
  },
  curated_by: {
    type: [{
      type: String
    }],
    default: []
  }
})

const pageSchema = new Schema({
  url: {
    type: String,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  thumbnail: {
    type: String
  },
  host_name: {
    type: String
  },
  amphtml: {
    type: String
  },
  tags: {
    type: [{
      type: String
    }],
    default: []
  },
  scores: [ scoreSchema ],
  created_at: {
    type: Date,
    default: () => Date.now()
  },
  curated_at: {
    type: Date,
    default: () => Date.now()
  }
});

pageSchema.statics = {
  findByUrl(url) {
    return this.findOne({
      url: url
    }).exec()
  },

  findCuratedNews(threshold, size){
    return this.find({
      "scores.score": { $gte: threshold }
    })
    .sort({curated_at: -1})
    .limit(size)
    .populate('scores.category', 'name title')
    .exec()
  },

  findCuratedNewsByCategory(categoryIds, threshold, size){
    return this.find({
      "scores": {
        "$elemMatch": {
          "category": { $in: categoryIds },
          "score": { $gte: threshold }
        }
      }
    })
    .sort({curated_at: -1})
    .limit(size)
    .populate('scores.category', 'name title')
    .exec()
  }
}


module.exports = mongoose.model("Page", pageSchema);