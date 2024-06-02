const mongoose = require('mongoose');

// Create a user schema
const postSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  title: {
    type: String,
  },
  price: {
    type: String,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  category: {
    type: String,
  },
  mobNumber: {
    type: String,
  },
  hostel: {
    type: String,
  },
  roomNum: {
    type: String,
  },
});

module.exports = mongoose.model('post', postSchema);