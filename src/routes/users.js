/**
* Handles Chat, Profile, and Home pages
*
**/
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');
const Chat = mongoose.model('Chat');
const fileUpload = require('express-fileupload');

// AUTHENTICATED ROUTES
router.use(function(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated() && req.user)
      return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
});
// // LISTPEERS = "LIST"
// ADDFRIEND = "ADDF"
// INFO = "INFO"
// DOGINFO = "DINF"
// MEET = "MEET"
// REPLY = "REPLY"
// QUERY = "QUER"
// QRESP = "QRES"
// ERROR = "ERRO"
/* GET user profile page */
router.get('/users/:username',function(req, res, next) {
  const username = req.params.username;
  User.findOne({ username: username }).populate('friends', ['first', 'last', 'username', 'location']).exec((err, user) =>{
    if (err){ res.render('error', { message: 'User was not found!'}); }
    if (req.user.username === username){ // viewing own profile
      console.log(user.chats);
      res.render('profile', { user : user, friends: user.friends, location: user.location, dogs: user.dogs, owner : true, chats: user.chats });
    }else{ // viewing other's profile
      res.render('profile', { user : user, friends: user.friends, location: user.location, dogs: user.dogs, owner : false, chats: user.chats });
    }

  });
});

router.get('/users/:username/list', function(req, res, next){
  const username = req.params.username;
  User.findOne({ username: username }).populate('friends', ['first', 'last', 'username', 'location']).exec((err, user) =>{
    res.send(user.friends);
  });
});

router.get('/users/:username/add', function(req, res, next){
  const username = req.params.username;
  if(username !== req.user.username){
    User.findOne({ username: req.user.username}, (err, addingUser) =>{
      if(!err){
        User.findOneAndUpdate({ username: req.params.username }, { $push: { friends: addingUser }}, { new: true }, (err, newFriend) =>{
          addingUser.friends.push(newFriend._id);
          addingUser.save(function(err){
            res.redirect('/users/' + req.user.username);
          });

        });
      }
    });

  }
});

router.get('/users/:username/meet', function(req, res, next){
  res.render('meetup', { requesting_user: req.user})
});

router.post('/users/:username/meet', function(req, res, next){
  const text = { time: req.body.time, location: req.body.location, date: req.body.date };
  User.findOne({ username: req.params.username }, (err, paramUser) =>{
    const c = new Chat({
      user1: req.user._id,
      user2: paramUser._id,
      text: text
    });
    c.save(function(err){
      User.findOneAndUpdate({ username: req.user.username }, { $push: { chats: c } }, (err, user) =>{
        User.findOneAndUpdate({ username: req.params.username },{ $push: { chats: c } }, (err, requestedUser) =>{
          res.redirect('/users/' + req.user.username);
        });
      });
    });
  });


});

/*GET on user edit page*/
router.get('/users/:username/edit', function(req, res, next){
  const username = req.params.username;
  if(req.user.username !== username) res.redirect('/users/' + req.user.username + '/edit');
  User.findOne({ username: username }, (err, user) => {
    res.render('edit', { user: req.user});
  });
});

/*POST on user edit page*/
router.post('/users/:username/edit', function(req, res, next){
  const username = req.params.username;
  if(req.user.username !== username) res.redirect('/users/' + req.user.username + '/edit');
  const dog = new Dog({
    name: req.body.name,
    age: Number(req.body.age),
    breed: req.body.breed
  });
  User.findOneAndUpdate({ username: username}, { $push: { dogs: dog } }, { new: true }, (err, dog) =>{
    if (err)res.render('error', err);
    res.redirect('/users/' + req.user.username);
  });
});


module.exports = router;
