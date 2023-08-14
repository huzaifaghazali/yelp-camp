// Models
const Campground = require('../models/campgrounds');
const Review = require('../models/review');

// Errors
const catchAsync = require('../utils/catchAsync');

// Create a review
const createReview = catchAsync(async (req, res) => {
  const { id } = req.params;
  // Get the specific campground
  const campground = await Campground.findById(id);
  // Create review
  const review = new Review(req.body.review);
  review.author = req.user._id; // Associate the newly created review with logged user
  // Push the review in Campground model
  campground.reviews.push(review);

  await review.save();
  await campground.save();

  req.flash('success', 'Created a new review!'); // sets up a flash message with the type "success" in the req object
  res.redirect(`/campgrounds/${campground._id}`); // Go to the campground in which review is created
});

// Delete review
const deleteReview = catchAsync(async (req, res) => {
  const { id, reviewId } = req.params;

  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // remove the reviewId from the 'reviews' array of the specified campground.

  // Delete review
  await Review.findByIdAndDelete(reviewId);

  req.flash('success', 'Successfully Deleted a review!'); // sets up a flash message with the type "success" in the req object
  res.redirect(`/campgrounds/${id}`); // Go to the campground in which review is deleted
});

module.exports = {
  createReview,
  deleteReview,
};
