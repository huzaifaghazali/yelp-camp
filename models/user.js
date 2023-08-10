const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
   email: {
      type: String,
      required: true,
      unique: true,
   }
});
userSchema.plugin(passportLocalMongoose); // Enhances your userSchema with additional fields, methods, and functionalities related to local authentication. 

module.exports = mongoose.model('User', userSchema);