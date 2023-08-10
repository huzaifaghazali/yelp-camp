// Packages
const express = require('express');
const router = express.Router({ mergeParams: true }); // allows you to pass parameters from the parent router (if any) to the child router.

// Models
const Campground = require('../models/campgrounds');
const Review = require('../models/review');

// Middleware
const { validateReview } = require('../middleware/campground');

// Errors
const catchAsync = require('../utils/catchAsync');

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
