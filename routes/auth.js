/**
* Handles Auth via Login, Signup, and Logout
**/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = require('mongodb').ObjectID;
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const saltRounds = 10;

/* GET home page. */
router.get('/', function(req, res, next) {
  //Check session data for automatic redirect
  if(req.user){
    res.redirect('/users/' + req.user.username);
  }else{
    res.render('index', { title: 'Puppy Playdate', error: req.flash('error') });
  }
});

/* POST home page for login */
router.post('/',
  passport.authenticate('local', { failureRedirect: '/', failureFlash: true}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    if(req.user){
      res.redirect('/users/' + req.user.username);
    }
  });

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

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.password, salt, function(err, hash) {
        // create new user
        const newUser = new User({
          first: req.body.firstname,
          last: req.body.lastname,
          username: req.body.username,
          password: hash,
          salt: salt,
          location: Number(req.body.zipcode),
          admin: true,
          created_at: new Date().toString()
        });

        // save and redirect
        newUser.save(function(err){
          if(err)  console.log(err);
          else {
            console.log("Created user!");
            req.login(newUser, function(err){
              if(err){return next(err);}
              return res.redirect('/');
            });
          }
        });

    });
});



});


router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
});
module.exports = router;
