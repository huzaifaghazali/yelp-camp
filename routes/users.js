const express = require('express');
const router = express.Router();

const passport = require('passport');

// Controllers
const {
  showRegisterForm,
  registerUser,
  showLoginForm,
  loginUser,
} = require('../controllers/user');

// Show the Register form
router.get('/register', showRegisterForm);

// Register a new user.
router.post('/register', registerUser);

// Show the Login form
router.get('/login', showLoginForm);

// Login user.
// provided by Passport.js to authenticate users
router.post(
  '/login',
  passport.authenticate('local', {
    // the strategy used is 'local', which typically refers to local username and password authentication.
    failureFlash: true, // on failure display a flash message
    failureRedirect: '/login', // redirect back to login
  }),
  loginUser
);

module.exports = router;
