var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Dog schema
var Dog = new Schema({
  name: String,
  age: Number,
  breed: String,
  description: String
});

// User schema
var User = new Schema({
  name: {first:String, last:String},
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  admin: Boolean,
  location: Number, //zip code
  age: Number,
  created_at: Date,
  dogs: [Dog]
});

mongoose.model('Dog', Dog);
mongoose.model('User', User);

mongoose.connect('mongodb://localhost/puppyplaydate');
