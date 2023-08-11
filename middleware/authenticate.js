// req.isAuthenticated() is a method provided by Passport.js that checks whether a user is authenticated or logged in.
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};
