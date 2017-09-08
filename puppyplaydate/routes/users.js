var express = require('express');
var router = express.Router();

// AUTHENTICATED ROUTES
app.use(function(req, res, next) {
  if (req.user){
      return next();
  }
  else {
    res.redirect('/');
  }
});

/* GET users listing. */
router.get('/:username',function(req, res, next) {
  console.log(req.user);

  res.render('home', {user:req.user});
});

module.exports = router;
