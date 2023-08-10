// Packages
const express = require('express');
const router = express.Router({ mergeParams: true }); // allows you to pass parameters from the parent router (if any) to the child router.

// controllers
const { createReview, deleteReview } = require('../controllers/review');

// Middleware
const { validateReview } = require('../middleware/campground');

// Create Review
router.post('/', validateReview, createReview);

// Delete Review
router.delete('/:reviewId', deleteReview);

module.exports = router;
