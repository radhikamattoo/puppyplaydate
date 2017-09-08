var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var flash = require('connect-flash');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var session = require('express-session');

var app = express();

// Database Setup
require('./database');
var User = mongoose.model('User');
var Dog = mongoose.model('Dog');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

var sessionOptions = {
		secret: 'secret thang',
		saveUninitialized: false,
		resave: false
};

// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions));

// Routing
var routes = require('./routes/index');
var users = require('./routes/users');

//Authentication using Passport
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
  console.log('handling request for: ' + req.url + "\n\n");
  next();
});

//Set up strategies for user authentication:

//regular username-password login
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (user.password !== password) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

//Facebook login
passport.use(new FacebookStrategy({
    clientID: 274235506408825,
    clientSecret: '761b127e8ec855dd8056c0c4f5894b13',
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {

		//get info to create user
		var password = profile.id;
		var firstName;
		var lastName;
		var username;

		if(profile.name.givenName){
			firstName = profile.name.givenName;
			lastName = profile.name.familyName;
		}else{
			var fullname = profile.displayName;
			firstName = fullname.split(" ")[0];
			lastName = fullname.split(" ")[1];
		}
		if(!profile.username){
			username = firstName + "-" + lastName;
		}else{
			username = profile.username;
		}
    User.findOne({username:username, password:password}, function(err, user,created){
			if(!user){
				var date = new Date().toString();
				var newUser = new User({
					name: {first:firstName, last:lastName},
					username:username,
					password:password,
					admin: false,
					created_at:date
				});
				newUser.save(function(err){
					if(err) return done(err);
					else return done(null, newUser);
				});
			}else{
				return done(null, user);
			}
		});
  }
));
// passport.use(new GoogleStrategy({}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findOne({_id:id}, function(err, user){
		done(err, user);
	});
});

//ROUTING
app.use('/', routes);
app.use('/', users);

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
