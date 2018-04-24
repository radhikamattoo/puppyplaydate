/**
* Handles Chat, Profile, and Home pages
*
**/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');
const fileUpload = require('express-fileupload');

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
  const username = req.params.username;
  User.findOne({ username: username }, (err, user) => {
    if (err){ res.render('error', { message: 'User was not found!'}); }
    Dog.find({ owner: user._id }, (err, dogs) =>{
      if (err) { dogs = []; }
      if (user.username === username){ // viewing own profile
        res.render('profile', { user : user, friends: user.friends, location: user.location, dogs: dogs, owner : true });
      }else{ // viewing other's profile
        res.render('profile', { user : user, friends: user.friends, location: user.location, dogs: dogs, owner : false });
      }
    });

  });
});

/*GET on user edit page*/
router.get('/users/:username/edit', function(req, res, next){
  if(req.params.username === req.user.username){
    res.render('edit', { user: req.params.username});
  }else{
    const redirectUrl = '/users/' + req.user.username + '/edit';
    res.redirect(redirectUrl);
  }
});

/*POST on user edit page*/
router.post('/users/:username/edit', function(req, res, next){

});


module.exports = router;
