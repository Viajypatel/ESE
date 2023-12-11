const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/pintrestbase")
// Create a user schema
const userSchema =mongoose.Schema({
  username:{
    type: String,
  },
  fullname:{
    type: String,
  },
  email:{
    type:String,
  },
  password:{
    type: String,
  },
  profileImage:{
    type: String,
  },
  contact:{
    type:Number,
  },
  boards:{
    type:Array,
    default:[]
  },
  posts:
  [
    {
    type:mongoose.Schema.Types.ObjectId,
    ref:"post"
  }
]
});

// Create a User model using the schema
userSchema.plugin(plm);
module.exports = mongoose.model('user', userSchema);

