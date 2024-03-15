const mongoose = require('mongoose');
const plm=require("passport-local-mongoose");
const dburl = "mongodb+srv://vijaypatel114200:T7hRFvntTqwHE4y4@cluster0.zz20hw5.mongodb.net/Vijaydb";
mongoose.connect(dburl);

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

