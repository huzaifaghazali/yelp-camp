const express = require('express');
const router = express.Router();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
  res.render('users/register');
});

router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      // creates a new instance of the User model
      const user = new User({ email, username });
      // method User.register() handles the process of creating a new user document, hashing the password, and saving it to the database.
      const registeredUser = await User.register(user, password);  // registers a new user using the User.register() method provided by passport-local-mongoose.
      console.log(registeredUser);
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/register');
    }
  })
);

module.exports = router;
