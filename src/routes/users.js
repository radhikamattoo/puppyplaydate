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
  if(viewingUser === req.user.username){
    console.log("Viewing own profile");
    res.render('profile', { user : req.user, friends: req.user.friends, location: req.user.location, owner : true });
  }else{
    console.log("Viewing someone else's profile");
    User.find({ username : viewingUser }, function(err, user){
      res.render('profile', { user : user, owner : false });
[]
    });
  }
});

/*GET on user edit page*/
router.get('/users/:username/edit', function(req, res, next){
  if(req.params.username === req.user.username){
    res.render('editUser', { user: req.params.username});
  }else{
    const redirectUrl = '/users/' + req.user.username + '/edit';
    res.redirect(redirectUrl);
  }
});

/*POST on user edit page*/
router.post('/users/:username/edit', function(req, res, next){

});
/* GET user chat general page */
router.get('/chat',function(req, res, next) {
  //check req.param for users who are chatting
  res.render('chat', {user:req.user});
});

/* GET user chat general page */
router.get('/map',function(req, res, next) {
  //check req.param for users who are chatting
  res.render('map', {user:req.user});
});


module.exports = router;
