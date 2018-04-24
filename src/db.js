const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GoogleKey
});

const Chat = new Schema({
  user1: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  user2: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  text: [String]
});

// Dog schema
const Dog = new Schema({
  name: String,
  age: Number,
  breed: String,
  description: String,
  images: [{ data: Buffer, contentType: String}],
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

// User schema
const User = new Schema({
  first: { type: String, required: true}, //first name
  last: { type: String, required: true}, //last name
  username: { type: String, required: true, unique: true },
  password: { type: String, minlength: 4, required: true },
  salt: { type: String, required: true},
  email: { type: String, required: true},
  admin: Boolean,
  location: Number, //zip code
  created_at: Date,
  dogs: [Dog],
  friends: [this],
  chats: [Chat]
});

mongoose.model('User', User);
mongoose.model('Dog', Dog);

// TODO: CHANGE TO PRODUCTION SERVER WHEN DEPLOYED
mongoose.connect('mongodb://localhost/puppyplaydate');
