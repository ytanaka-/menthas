const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storeSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  state: {
    type: String
  }
});


module.exports = mongoose.model("Store", storeSchema);