const express = require('express');
const router = express.Router();

const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
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
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  loginUser
);

module.exports = router;
