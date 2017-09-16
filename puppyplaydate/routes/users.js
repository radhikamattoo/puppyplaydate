/**
* Handles Chat, Profile, and Home pages
*
**/
const express = require('express');
const router = express.Router();

// AUTHENTICATED ROUTES
router.use(function(req, res, next) {
  if (req.user){
      return next();
  }
  else {
    res.redirect('/');
  }
});

/* GET user home page */
router.get('/:username',function(req, res, next) {
  console.log(req.user);

  res.render('home', {user:req.user});
});

module.exports = router;

/* GET user profile page */

/* GET user edit page */

/* GET user chat page */
