const mongoose = require('mongoose');

const mongoUrl = 'mongodb://127.0.0.1:27017/yelp-camp';

// remove the deprecation warning
mongoose.set('strictQuery', false);
const connectDB = () => {
  return mongoose.connect(mongoUrl);
};

module.exports = connectDB;
