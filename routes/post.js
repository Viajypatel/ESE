const mongoose = require('mongoose');
// Create a user schema
const postSchema =mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"user",
  },
  title:{
    type: String,
  },
  description:{
    type: String,
  },
  image:{
    type: String,
  }
});


module.exports= mongoose.model('post', postSchema);
