var express = require('express');
var router = express.Router();

function isAuthenticated(req, res, next) {

    // do any checks you want to in here

    // CHECK THE USER STORED IN SESSION FOR A CUSTOM VARIABLE
    // you can do this however you want with whatever variables you set up
    if (req.user)
        return next();

    // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SOMEWHERE
    else res.redirect('/');
}

/* GET users listing. */
router.get('/:username', isAuthenticated,function(req, res, next) {
  console.log(req.user);

  res.render('home', {user:req.user});
});

module.exports = router;
