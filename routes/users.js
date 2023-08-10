const express = require('express');
const router = express.Router();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

// Show the Register form
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Register a new user.
router.post(
  '/register',
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      // creates a new instance of the User model
      const user = new User({ email, username });
      // method User.register() handles the process of creating a new user document, hashing the password, and saving it to the database.
      const registeredUser = await User.register(user, password); // registers a new user using the User.register() method provided by passport-local-mongoose.
      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/register');
    }
  })
);

// Show the Login form
router.get('/login', (req, res) => {
  res.render('users/login');
});

// Login user.
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  catchAsync(async (req, res) => {
    try {
      req.flash('success', 'Welcome Back!');
      res.redirect('/campgrounds');
    } catch (error) {
      req.flash('error', error.message);
      res.redirect('/login');
    }
  })
);

module.exports = router;
