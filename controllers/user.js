// Model
const User = require('../models/user');

// Errors
const catchAsync = require('../utils/catchAsync');

// Show the Register form
const showRegisterForm = (req, res) => {
  res.render('users/register');
};

// Register the user
const registerUser = catchAsync(async (req, res) => {
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
});

// Show Login form
const showLoginForm = (req, res) => {
  res.render('users/login');
};

// Login the user
const loginUser = catchAsync(async (req, res) => {
  try {
    req.flash('success', 'Welcome Back!');
    res.redirect('/campgrounds');
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/login');
  }
});

module.exports = {
  showRegisterForm,
  registerUser,
  showLoginForm,
  loginUser
};
