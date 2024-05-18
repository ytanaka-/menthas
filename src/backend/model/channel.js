const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("./category");

const channelSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  categories: {
    type: [
      {
        type: Schema.ObjectId,
        ref: "Category",
      },
    ],
    default: [],
  },
  position: {
    type: Number,
    default: 0,
  },
});

channelSchema.statics = {
  findAll() {
    return this.model("Channel").find({}).sort({ position: 1 }).exec();
  },

  findByName(channelName) {
    return this.findOne({
      name: channelName,
    }).exec();
  },
};

module.exports = mongoose.model("Channel", channelSchema);
