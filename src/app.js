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
require('dotenv').config();

// DATABASE
require('./db');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');

const auth = require('./routes/auth');
const users = require('./routes/users');
const chat = require('./routes/chat');

const app = express();

// TODO: SET TO PRODUCTION WHEN DEPLOYED
// app.set('env', 'production');
console.log("\nApp is in " + app.get('env').toUpperCase() + " mode\n");


// VIEW ENGINE
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

const sessionOptions = {
		secret: 'secret thang',
		saveUninitialized: false,
		resave: false,
		cookie: {
			secure: false,
			maxAge: Number(process.env.maxAge)
		}
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
			if(!user) return done(null, false, req.flash('error', 'Invalid username and/or password'));
			bcrypt.compare(password, user.password, (err,res) => {
				if(err) return done(null, false, req.flash('error', 'Invalid username and/or password'));
				return done(null, user);
			});
    });
  }
));

//FACEBOOK
passport.use(new FacebookStrategy({
    clientID: process.env.fbClientId,
    clientSecret: process.env.fbClientSecret,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
		profileFields: ['id', 'displayName', 'location', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
		//get info to create user
		const location = profile._json.location.id;
		const password = profile.id;
		const email = profile._json.email;
		let firstName;
		let lastName;

		if(profile.name.givenName && profile.name.familyName){
			firstName = profile.name.givenName;
			lastName = profile.name.familyName;
		}else{
			let fullname = profile.displayName;
			firstName = fullname.split(" ")[0];
			lastName = fullname.split(" ")[1];
		}
		const username = firstName + lastName + location;

		User.findOne({email: email}, function(err, user){
			if(!user){ //create new user
				bcrypt.genSalt(Number(process.env.saltRounds), (err, salt) => {
					bcrypt.hash(password, salt, (err, hash) => {

						let date = new Date().toString();
						const newUser = new User({
							first: firstName,
							last: lastName,
							username:username,
							password:hash,
							salt: salt,
							email: email,
							admin: false,
							location: location,
							created_at:date
						});
						newUser.save(function(err){
							if(err) return done(err);
							else return done(null, newUser);
						});

					}); //hash
				}); //genSalt
			}else{ //login!
				bcrypt.compare(password, user.password, (err,res) => {
					if(err) return done(null, false, req.flash('error', 'Invalid username and/or password'));
					return done(null, user);
				});
			}
		}); //user findone
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
app.use('/', chat);

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
