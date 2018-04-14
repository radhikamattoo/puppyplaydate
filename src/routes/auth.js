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
require('dotenv').config();

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
router.post('/login',
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
router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));

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
  const saltRounds = Number(process.env.saltRounds);
  const password = req.body.password;
  bcrypt.genSalt(saltRounds, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      // create new user
      const newUser = new User({
        first: req.body.firstname,
        last: req.body.lastname,
        username: req.body.username,
        email: req.body.email,
        password: hash,
        salt: salt,
        location: Number(req.body.zipcode),
        admin: true,
        created_at: new Date().toString()
      });
      // save and redirect
      newUser.save(function(err){
        if(err) {
          res.render('error', {error: err});
        }
        else {
          req.login(newUser, function(err){
            if(err){res.render('error', {error: err});}
            return res.redirect('/');
          });
        }
      }); //save
    }); //hash
  }); //salt

});


router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/');
});
module.exports = router;
