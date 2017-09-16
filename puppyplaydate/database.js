const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDEveioqvDh55H1_lOP44u58uHputstsRs'
});
// Dog schema
const Dog = new Schema({
  name: String,
  age: Number,
  breed: String,
  description: String
});

// User schema
const User = new Schema({
  name: {first:String, last:String},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: Number, //zip code
  created_at: Date,
  dogs: [Dog],
  friends: [this]
});

mongoose.model('Dog', Dog);
mongoose.model('User', User);

mongoose.connect('mongodb://localhost/puppyplaydate');
