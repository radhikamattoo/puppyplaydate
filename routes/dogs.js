const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');

// Changing/creating dog profile image
router.post('/dogs/:username', function(req,res,next){

});
