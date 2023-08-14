// Packages
const express = require('express');
const router = express.Router({ mergeParams: true }); // allows you to pass parameters from the parent router (if any) to the child router.

// controllers
const { createReview, deleteReview } = require('../controllers/review');

// Middleware
const { validateReview } = require('../middleware/campground');
const { isLoggedIn } = require('../middleware/authenticate');

// Authenticate the user then Create Review
router.post('/', isLoggedIn, validateReview, createReview);

// Authenticate the user then Delete Review
router.delete('/:reviewId', isLoggedIn, deleteReview);

module.exports = router;
