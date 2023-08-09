// Packages
const express = require('express');
const router = express.Router({ mergeParams: true }); // allows you to pass parameters from the parent router (if any) to the child router.

// Models
const Campground = require('../models/campgrounds');
const Review = require('../models/review');
const { reviewSchema } = require('../schemas');

// Errors
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Joi validation review middleware
const validateReview = (req, res, next) => {
  // validation the data as described in validation schema
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    // Throw the error if data is invalid
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next(); // Go to the next middleware function
  }
};

// Create Review
router.post(
  '/',
  validateReview,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    // Get the specific campground
    const campground = await Campground.findById(id);
    // Create review
    const review = new Review(req.body.review);
    // Push the review in Campground model
    campground.reviews.push(review);

    await review.save();
    await campground.save();

    req.flash('success', 'Created a new review!'); // sets up a flash message with the type "success" in the req object
    res.redirect(`/campgrounds/${campground._id}`); // Go to the campground in which review is created
  })
);

// Delete Review
router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // remove the reviewId from the 'reviews' array of the specified campground.

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully Deleted a review!'); // sets up a flash message with the type "success" in the req object
    res.redirect(`/campgrounds/${id}`); // Go to the campground in which review is deleted
  })
);

module.exports = router;
