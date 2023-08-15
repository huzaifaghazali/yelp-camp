const express = require('express');
const router = express.Router();

const passport = require('passport');

// Controllers
const {
  showRegisterForm,
  registerUser,
  showLoginForm,
  loginUser,
  logoutUser,
} = require('../controllers/user');

// middleware
const { storeReturnTo } = require('../middleware/authenticate');

router
  .route('/register')
  .get(showRegisterForm) // Show the Register form
  .post(registerUser); // Register a new user.

router
  .route('/login')
  .get(showLoginForm) // Show the Login form
  .post(
    storeReturnTo, // Store the path
    // provided by Passport.js to authenticate users
    passport.authenticate('local', {
      // the strategy used is 'local', which typically refers to local username and password authentication.
      failureFlash: true, // on failure display a flash message
      failureRedirect: '/login', // redirect back to login
    }),
    loginUser // Login user.
  );

// Logout user
router.get('/logout', logoutUser);

module.exports = router;
