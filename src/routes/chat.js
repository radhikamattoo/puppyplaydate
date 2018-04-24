/**
* Handles Chat, Profile, and Home pages
*
**/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');

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
