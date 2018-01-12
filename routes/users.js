/**
* Handles Chat, Profile, and Home pages
*
**/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');


// AUTHENTICATED ROUTES
router.use(function(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated() && req.user)
      return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
});

/* GET user profile page */
router.get('/users/:username',function(req, res, next) {
  const viewingUser = req.params.username;
  if(viewingUser == req.user.username){
    console.log("Viewing own profile");
    res.render('profile', { user : req.user, owner : true });
  }else{
    console.log("Viewing someone else's profile");
    User.find({ username : viewingUser }, function(err, user){
      res.render('profile', { user : user, owner : false });

    });
  }
});

/* POST on user (EDIT) */
router.post('/users/:username',function(req, res, next) {
  // res.render('home', {user:req.user});
});

/* GET user chat general page */
router.get('/chat',function(req, res, next) {
  //check req.param for users who are chatting
  res.render('chat', {user:req.user});
});


module.exports = router;
