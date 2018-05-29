/**
* Handles Chat, Profile, and Home pages
*
**/
const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Dog = mongoose.model('Dog');
const Chat = mongoose.model('Conversation');
const Message = mongoose.model('Message');
const multer  = require('multer');
const upload = multer({ dest: 'src/public/images' });

// AUTHENTICATED ROUTES
router.use(function(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated() && req.user)
      return next();
  // if they aren't redirect them to the home page
  res.redirect('/');
});

router.get('/images/:filename', function(req, res, next){

});

/* GET user profile page */
router.get('/users/:username',function(req, res, next) {
  const username = req.params.username;
  User.findOne({ username: username }).populate('friends', ['first', 'last', 'username', 'location']).populate('dogs', ['name', 'age', 'breed', 'description', 'images']).exec((err, user) =>{
    if (err){ res.render('error', { message: 'User was not found!'}); }
    if (req.user.username === username){ // viewing own profile
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

/*GET on user edit page*/
router.get('/users/:username/edit', function(req, res, next){
  const username = req.params.username;
  if(req.user.username !== username) res.redirect('/users/' + req.user.username + '/edit');
  User.findOne({ username: username }, (err, user) => {
    res.render('edit', { user: req.user});
  });
});

/*POST on user edit page*/
router.post('/users/:username/edit', upload.array('images', 3), function(req, res, next){
  const username = req.params.username;
  if(req.user.username !== username){ res.redirect('/users/' + req.user.username + '/edit');}
  if(req.body.newName){ // Adding a new dog
    const images = req.files.map((img) =>{
      const filepath = path.join('/images/', img.filename);
      return {
        src: filepath
      }
    });
    const dog = new Dog({
      name: req.body.newName,
      age: Number(req.body.newAge),
      breed: req.body.newBreed,
      images: images
    });
    dog.save((err, dog) =>{
      console.log(dog, err);
      if (err){ res.render('error', err); }
      User.findOneAndUpdate({ username: username}, { $push: { dogs: dog._id } }, { new: true }, (err, dog) =>{
        if (err){ res.render('error', err); }
        else { res.redirect('/users/' + req.user.username); }
      });
    });
  }else if(req.body.name){ //editing an existing dog

  }else{
    res.render('error', { message: 'Cannot edit dog :(', username: req.user.username})
  }
});


module.exports = router;
