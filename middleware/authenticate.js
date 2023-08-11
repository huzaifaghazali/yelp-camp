// req.isAuthenticated() is a method provided by Passport.js that checks whether a user is authenticated or logged in.
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // stores the original URL that the user requested in the user's session under the key returnTo.
    req.session.returnTo = req.originalUrl // contains the URL that the user initially requested.
    req.flash('error', 'You must be signed in first!');
    return res.redirect('/login');
  }
  next();
};

module.exports.storeReturnTo = (req, res, next) => {
  // checks if req.session.returnTo exists
  if (req.session.returnTo) {
    // sets a local variable named returnTo in the res.locals object.
      res.locals.returnTo = req.session.returnTo;
  }
  next();
}