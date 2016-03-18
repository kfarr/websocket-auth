var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

function Player(connection, id) {
    this.connection = connection;
    this.id = id;
    this.position = {x: 0, y: 0, z: 0};
    this.orientation = {x: 0, y: 0, z: 0, w: 1};
    this.kills = 0;
    this.deaths = 0;
    this.sendCommand = function(command) {
        this.connection.sendUTF(JSON.stringify(command));
    };
    return this;
}

players = {}

// view engine setup
app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  console.log("serializeUser requested, user = " + user);
  players[user] = new Player(null, user);
  done(null, user);
});

passport.deserializeUser(function(id, done) {
  console.log("deserializeUser requested, id = " + id);
  done(null, players[id]);
//  User.findById(id, function(err, user) {
//    done(err, user);
//  });
});

// routes
app.use('/', routes);
app.use('/users', users);

// twitter auth routes - TODO this could be placed in /users
app.get('/auth/twitter',
  passport.authenticate('twitter'));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


// Define routes.
app.get('/',
  function(req, res) {
    res.render('home', { user: req.user });
});

app.get('/login',
  function(req, res){
    res.render('login');
});

  app.get('/login/twitter',
    passport.authenticate('twitter'));

  app.get('/login/twitter/return',
    passport.authenticate('twitter', { failureRedirect: '/login' }),
    function(req, res) {
      res.redirect('/');
    });

  app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.render('profile', { user: req.user });
    });


// passport - sessions - twitter
passport.use(new TwitterStrategy({
    consumerKey: "Abv0qwzcRUkqCU9sPDl0BB2rB",
    consumerSecret: "",
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
//    players.findOrCreate( twitterId: profile.id);
    console.log("New user profile id = " + profile.id);
    return cb(null, profile.id);
    // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
  }
));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
