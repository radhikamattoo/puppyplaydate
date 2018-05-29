const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const googleMapsClient = require('@google/maps').createClient({
  key: process.env.GoogleKey
});

const Conversation = new Schema({
  participants: [{ type: Schema.Types.ObjectId, ref: 'User'}],
});

const Message = new Schema({
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

const Dog = new Schema({
  name: String,
  age: Number,
  breed: String,
  description: String,
  images: [{ data: Buffer, contentType: String}],
  owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
});

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
  dogs: [{type: mongoose.Schema.Types.ObjectId, ref: 'Dog'}],
  friends: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  chats: [Conversation]
});

mongoose.model('User', User);
mongoose.model('Dog', Dog);
mongoose.model('Conversation', Conversation);
mongoose.model('Message', Message);

// TODO: CHANGE TO PRODUCTION SERVER WHEN DEPLOYED
mongoose.connect('mongodb://localhost/puppyplaydate');
