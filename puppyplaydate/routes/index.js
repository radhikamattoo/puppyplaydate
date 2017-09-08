var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var ObjectId = require('mongodb').ObjectID;
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').Strategy;
var LocalStrategy = require('passport-local').Strategy;
/* GET home page. */
router.get('/', function(req, res, next) {
  //Check session data for automatic redirect
  if(req.user){
    res.redirect('/' + req.user.username);
  }else{
    res.render('index', { title: 'Puppy Playdate' });
  }
});

/* POST home page for login */
router.post('/',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);

// Redirect the user to Facebook for authentication.  When complete,
// Facebook will redirect the user back to the application at
//     /auth/facebook/callback
router.get('/auth/facebook', passport.authenticate('facebook'));

// Facebook will redirect the user to this URL after approval.  Finish the
// authentication process by attempting to obtain an access token.  If
// access was granted, the user will be logged in.  Otherwise,
// authentication has failed.
router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

/* GET signup page. */
router.get('/signup', function(req, res, next){
  res.render('signup');
});
/* POST signup page. */
router.post('/signup', function(req,res,next){
  // create new user
  var newUser = new User({
    name: {first:req.body.firstname, last: req.body.lastname},
    username: req.body.username,
    password: req.body.password,
    admin: false,
    created_at: new Date().toString()
  });

  // save and redirect
  newUser.save(function(err){
    if(err)  console.log(err);
    else {
      req.login(newUser, function(err){
        if(err){return next(err);}
        return res.redirect('/');
      });
    }
  });
});
router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
});
module.exports = router;
