// Model
const Campground = require('../models/campgrounds');
const Review = require('../models/review');

// req.isAuthenticated() is a method provided by Passport.js that checks whether a user is authenticated or logged in.
module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    // stores the original URL that the user requested in the user's session under the key returnTo.
    req.session.returnTo = req.originalUrl; // contains the URL that the user initially requested.
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
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);

  // Check if Logged in user and campground user(who created) have same ID
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${campground._id}`);
  }

  next();
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);

  // Check if Logged in user and review user(who created) have same ID
  if (!review.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }

  next();
};
