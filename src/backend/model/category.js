const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
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
  curators: {
    type: [{
      type: String
    }],
    default: []
  },
  tags: {
    type: [{
      type: String
    }],
    default: []
  }
});

categorySchema.statics = {
  findAll(){
    return this.model("Category").find({}).exec()
  },

  findByName(categoryName){
    return this.findOne({
      name: categoryName
    }).exec()
  }
}

module.exports = mongoose.model("Category", categorySchema);