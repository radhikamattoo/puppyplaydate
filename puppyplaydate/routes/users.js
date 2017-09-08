var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/:username', function(req, res, next) {
  res.render('home', {user:req.user});
});

module.exports = router;
