var express = require('express');
var router = express.Router();
const userModel=require("./users");
const passport = require('passport');
const upload =require("./multer");
const postModel=require("./post");
const localStrategy=require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});
router.get('/register', function(req, res, next) {
  res.render("register",{nav:false});
});

router.get("/profile",isLoggedIn,async function(req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user
  }).populate("posts");
  res.render("profile",{user,nav:true});   
});
router.get("/show/posts",isLoggedIn,async function(req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user
  }).populate("posts");
  res.render("show",{user,nav:true});   
})

router.get("/feed",isLoggedIn,async function(req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  const posts=await postModel.find().populate('user') ;
  res.render("feed",{user,posts,nav:true});  
});

router.get("/add",isLoggedIn,async function(req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user
  })
  res.render("add",{user,nav:true}) 
});
router.post("/createpost",isLoggedIn,upload.single("postimage"),async function(req, res, next) {
  const user=await userModel.findOne({
    username:req.session.passport.user
  });
  if (req.file) {
    const post = await postModel.create({
      user: user._id,
      title: req.body.title,
      description: req.body.description,
      image: req.file.filename,
    });

    user.posts.push(post._id);
    await user.save();
    res.redirect("/profile");
  } else {
    console.error('No file uploaded');
    res.status(400).send('Bad Request');
  }  
});
router.post('/fileupload',isLoggedIn,upload.single("image"),  async function (req, res,next) {
  const user=await userModel.findOne({username:req.session.passport.user});
  user.profileImage=req.file.filename;
  await user.save();
  res.redirect("/profile");
});

router.post("/register",function(req,res,next){
  const userData=new userModel({
    username:req.body.username,
    email:req.body.email,
    contact:req.body.contact,
    fullname:req.body.fullname
  })
  userModel.register(userData,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile");
    })
})
})

router.post("/login",passport.authenticate("local",{
  successRedirect:"/profile",
  failureRedirect:"/",
}),function(req,res){
});

router.get('/logout', function(req, res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next)
{
  // Passport adds the isAuthenticated function to request object
  if (req.isAuthenticated()) {
      // User is authenticated, continue to the next middleware or route handler
      return next();
  }
  res.redirect("/");
}
// Route to delete a post
router.post('/posts/delete/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const postId = req.params.postId;
    const user = await userModel.findOne({ username: req.session.passport.user });

    // Check if the user owns the post
    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    if (post.user.toString() !== user._id.toString()) {
      return res.status(403).send('Unauthorized to delete this post');
    }

    // Remove the post from the user's posts array
    const index = user.posts.indexOf(postId);
    if (index > -1) {
      user.posts.splice(index, 1);
      await user.save();
    }

    // Delete the post from the database
    await postModel.deleteOne({ _id: postId }); // Or use findOneAndDelete

    res.redirect("/show/posts");
  } catch (error) {
    next(error);
  }
});

// Route to show all posts by a specific user
router.get('/user/posts/:userId', async function(req, res, next) {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate('posts');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('userPosts', { user, nav: true }); // Render the template to display all posts by the user
  } catch (error) {
    next(error);
  }
});

module.exports = router;
