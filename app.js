const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const expressSession = require('express-session');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const passport = require('passport');
const MongoStore = require('connect-mongo'); // Import connect-mongo
const mongoose = require('mongoose'); // Import mongoose

const app = express();

// view engine setup
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB connection setup
const dburl = "mongodb+srv://vijaypatel114200:T7hRFvntTqwHE4y4@cluster0.zz20hw5.mongodb.net/Vijaydb";
mongoose.connect(dburl, { useNewUrlParser: true, useUnifiedTopology: true });

// Configure session middleware
app.use(expressSession({
  resave: false, 
  saveUninitialized: false,
  secret: "hey hi hello",
  store: new MongoStore({ 
    mongoUrl: dburl, // Provide the MongoDB URL directly
    dbName: 'Vijaydb', // Specify the database name
    mongooseConnection: mongoose.connection, // Provide mongoose connection as client
  })
}));

app.use(passport.initialize()); 
app.use(passport.session());
passport.serializeUser(usersRouter.serializeUser());
passport.deserializeUser(usersRouter.deserializeUser());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
