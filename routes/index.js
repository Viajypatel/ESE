var express = require('express');
var router = express.Router();
const userModel = require("./users");
const passport = require('passport');
const upload = require("./multer");
const postModel = require("./post");
const localStrategy = require("passport-local");
passport.use(new localStrategy(userModel.authenticate()));

const postSchema = require("./postSchema");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { nav: false });
});

router.get('/register', function(req, res, next) {
  res.render("register", { nav: false });
});

router.get('/post/:id', async function(req, res, next) {
  try {
    const post = await postModel.findById(req.params.id).populate('user');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('postdetails', { post, nav: true });
  } catch (error) {
    next(error);
  }
});

router.get('/home', async function(req, res, next) {
  try {
    const posts = await postModel.find().populate('user');
    res.render('home', { nav: true, user: req.user, posts }); // Pass posts to the template
  } catch (error) {
    next(error);
  }
});


// router.get('/home', function(req, res, next) {
//   res.render("home", { nav: true, user: req.user,posts });
// });

router.get('/about', function(req, res, next) {
  res.render("about", { nav: true, user: req.user });
});

router.get('/contact', function(req, res, next) {
  res.render("contact", { nav: true, user: req.user });
});

// router.get('/home/feed', function(req, res, next) {
//   res.render("/feed"); // Redirect to the feed page
// });
// router.get('/home/add', function(req, res, next) {
//   res.render("/add"); // Redirect to the feed page
// });

router.get('/home/feed', async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find().populate('user');
    res.render("feed", { user, posts, nav: true }); // Pass `posts` here
  } catch (error) {
    next(error);
  }
});

//cart
// Add route to save item to cart
router.post('/saveItem', async function(req, res, next) {
  try {
    const postId = req.body.postId;
    const user = await userModel.findOne({ username: req.session.passport.user });

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }

    // You may need to implement logic to save the item to the user's cart
    // For demonstration, we'll just log the saved item
    console.log('Item saved to cart:', post);

    res.status(200).json({ message: 'Item saved to cart successfully' });
  } catch (error) {
    next(error);
  }
});

router.get('/search', async function(req, res, next) {
  try {
    const searchQuery = req.query.q;
    // Query the database to find posts that match the search criteria
    const posts = await postModel.find({ $text: { $search: searchQuery } }).populate('user');

    // Assuming you have the user object available in req.user
    const user = req.user;

    res.render('searchResults', { user, posts, nav: true }); // Pass the user object to the view
  } catch (error) {
    next(error);
  }
});



router.get('/home/add', async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find().populate('user');
    res.render("add", { user, posts, nav: true }); // Pass `posts` here
  } catch (error) {
    next(error);
  }
});

router.get('/savedItems', async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Assuming the saved items are stored in the user's document
    const savedItems = user.savedItems || [];

    // Retrieve the details of the saved items from the database
    const savedItemsDetails = await Promise.all(savedItems.map(async (itemId) => {
      const item = await postModel.findById(itemId);
      return item;
    }));

    res.render('savedItems', { user, savedItems: savedItemsDetails, nav: true });
  } catch (error) {
    next(error);
  }
});


router.get("/profile", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");
    res.render("profile", { user, nav: true });
  } catch (error) {
    next(error);
  }
});

router.get("/show/posts", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user }).populate("posts");
    res.render("show", { user, nav: true });
  } catch (error) {
    next(error);
  }
});

// Add a route to show a single post
router.get('/posts/show/:id', async function(req, res, next) {
  try {
    const post = await postModel.findById(req.params.id).populate('user');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('show', { post, user: req.user, nav: true });
  } catch (error) {
    next(error);
  }
});

router.get("/feed", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find().populate('user');
    res.render("feed", { user, posts, nav: true }); // Make sure to pass `posts` here
  } catch (error) {
    next(error);
  }
});

router.get("/electronics", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find({ category: 'electronics' }).populate('user');
    res.render("electronics", { user, posts, nav: true });
  } catch (error) {
    next(error);
  }
});

//sports

router.get("/sports", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find({ category: 'sports' }).populate('user');
    res.render("sports", { user, posts, nav: true });
  } catch (error) {
    next(error);
  }
});


//fitneess

router.get("/fitness", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find({ category: 'fitness' }).populate('user');
    res.render("fitness", { user, posts, nav: true });
  } catch (error) {
    next(error);
  }
});


router.get("/book", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find({ category: 'book' }).populate('user');
    res.render("book", { user, posts, nav: true });
  } catch (error) {
    next(error);
  }
});


router.get("/furniture", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find({ category: 'furniture' }).populate('user');
    res.render("furniture", { user, posts, nav: true });
  } catch (error) {
    next(error);
  }
});


router.get("/others", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find({ category: 'others' }).populate('user');
    res.render("others", { user, posts, nav: true });
  } catch (error) {
    next(error);
  }
});





router.get("/add", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    res.render("add", { user, nav: true });
  } catch (error) {
    next(error);
  }
});

//sports page

router.get("/sports", isLoggedIn, async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    const posts = await postModel.find({ category: 'sports' }).populate('user');
    res.render("sports", { user, posts, nav: true });
  } catch (error) {
    next(error);
  }
});


router.post("/createpost", isLoggedIn, upload.single("postimage"), async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    if (req.file) {
      const post = await postModel.create({
        user: user._id,
        title: req.body.title,
        price: req.body.price,
        description: req.body.description,
        image: req.file.filename,
        category: req.body.category,
        mobNumber: req.body.mobNumber,
        hostel: req.body.hostel,
        roomNum: req.body.roomNum
      });
      user.posts.push(post._id);
      await user.save();
      res.redirect("/profile");
    } else {
      console.error('No file uploaded');
      res.status(400).send('Bad Request');
    }
  } catch (error) {
    next(error);
  }
});


router.post('/fileupload', isLoggedIn, upload.single("image"), async function(req, res, next) {
  try {
    const user = await userModel.findOne({ username: req.session.passport.user });
    user.profileImage = req.file.filename;
    await user.save();
    res.redirect("/profile");
  } catch (error) {
    next(error);
  }
});

router.post("/register", function(req, res, next) {
  const userData = new userModel({
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact,
    fullname: req.body.fullname
  });
  userModel.register(userData, req.body.password)
    .then(function() {
      passport.authenticate("local")(req, res, function() {
        res.redirect("/home");
      });
    });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/home",
  failureRedirect: "/",
}));

// Add a route to show a single post
router.get('/singleItem/:id', async function(req, res, next) {
  try {
    const post = await postModel.findById(req.params.id).populate('user');
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.render('postdetails', { post, user: req.user, nav: true });
  } catch (error) {
    next(error);
  }
});

router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/");
}

router.post('/posts/delete/:postId', isLoggedIn, async function(req, res, next) {
  try {
    const postId = req.params.postId;
    const user = await userModel.findOne({ username: req.session.passport.user });

    const post = await postModel.findById(postId);
    if (!post) {
      return res.status(404).send('Post not found');
    }
    if (post.user.toString() !== user._id.toString()) {
      return res.status(403).send('Unauthorized to delete this post');
    }

    const index = user.posts.indexOf(postId);
    if (index > -1) {
      user.posts.splice(index, 1);
      await user.save();
    }

    await postModel.deleteOne({ _id: postId });
    res.redirect("/show/posts");
  } catch (error) {
    next(error);
  }
});

router.get('/user/posts/:userId', async function(req, res, next) {
  try {
    const userId = req.params.userId;
    const user = await userModel.findById(userId).populate('posts');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('userPosts', { user, nav: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
