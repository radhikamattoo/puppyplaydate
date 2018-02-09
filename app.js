const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const session = require('express-session');
const rn = require('random-number');
const rnGen = rn.generator({integer: true});
const bcrypt = require('bcrypt');
const saltRounds = 10;

// DATABASE
require('./database');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');

const auth = require('./routes/auth');
const users = require('./routes/users');

const app = express();

// TODO: SET TO PRODUCTION WHEN DEPLOYED
console.log("\nApp is in " + app.get('env').toUpperCase() + " mode\n");
// app.set('env', 'production');


// VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

const sessionOptions = {
		secret: 'secret thang',
		saveUninitialized: false,
		resave: false
};

// MIDDLEWARE
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(sessionOptions));

//AUTHENTICATION SETUP
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

// LOCAL
passport.use(new LocalStrategy({
	passReqToCallback: true
},function(req, username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user || user.password !== password) {
        return done(null, false, req.flash('error', 'Invalid username and/or password'));
      }
      return done(null, user);
    });
  }
));

//FACEBOOK
passport.use(new FacebookStrategy({
    clientID: 274235506408825,
    clientSecret: '761b127e8ec855dd8056c0c4f5894b13',
    callbackURL: "http://localhost:3000/auth/facebook/callback",
		profileFields: ['id', 'displayName', 'location']
  },
  function(accessToken, refreshToken, profile, done) {
		//get info to create user
		const location = profile._json.location.id
		const password = profile.id;
		let firstName;
		let lastName;
		let username;

		if(profile.name.givenName){
			firstName = profile.name.givenName;
			lastName = profile.name.familyName;
		}else{
			let fullname = profile.displayName;
			firstName = fullname.split(" ")[0];
			lastName = fullname.split(" ")[1];
		}
		if(!profile.username){
			username = firstName + lastName + rnGen();
		}else{
			username = profile.username;
		}
		bcrypt.genSalt(saltRounds, function(err, salt) {
			bcrypt.hash(password, salt, function(err, hash) {
				User.findOne({username:username, password:hash}, function(err, user,created){
					if(!user){
						const date = new Date().toString();
						const newUser = new User({
							first: firstName,
							last: lastName,
							username:username,
							password:hash,
							salt: salt,
							admin: false,
							location: location,
							created_at:date
						});
						newUser.save(function(err){
							if(err) return done(err);
							else return done(null, newUser);
						});
					}else{
						return done(null, user);
					}
				}); //end findOne
			}); //hash
		}); //genSalt
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
app.use('/', auth);
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
