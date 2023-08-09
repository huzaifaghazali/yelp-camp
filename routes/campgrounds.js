// Packages
const express = require('express');
const router = express.Router();

// Model
const Campground = require('../models/campgrounds');
const { campgroundSchema } = require('../schemas');

// Errors
const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

// Joi validation campground middleware
const validateCampground = (req, res, next) => {
  // validation the data as described in validation schema
  const { error } = campgroundSchema.validate(req.body);

  if (error) {
    // Throw the error if data is invalid
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next(); // Go to the next middleware function
  }
};

// Get all the campgrounds
router.get('/', async (req, res) => {
  const campgrounds = await Campground.find({}); // Get all the Campgrounds
  res.render('campgrounds/index', { campgrounds }); // renders the 'campground/index' ejs view and pass campgrounds to it.
});

// This route must be above the id route
router.get('/new', async (req, res) => {
  res.render('campgrounds/new'); // renders the 'campground/new' form ejs view
});

// Create Campground
router.post(
  '/',
  validateCampground,
  catchAsync(async (req, res, next) => {
    // Throw error if data doesn't exist then catchAsync will catch it and pass it to middleware.
    if (!req.body.campground)
      throw new ExpressError('Invalid Campground data', 400);

    const data = req.body.campground;

    // Create a new campground
    const campground = new Campground(data);
    await campground.save();

    req.flash('success', 'Successfully made a new campground!'); // sets up a flash message with the type "success" in the req object
    res.redirect(`/campgrounds/${campground._id}`); // Go to the newly created campground
  })
);

// Get the specific Campground
router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews'); // Get the specific Campground and add reviews that are associated with it.
    res.render('campgrounds/show', { campground }); // renders the 'campground/show' ejs view and pass campground to it.
  })
);

// Get the specific Campground for edit
router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Get the specific Campground
    res.render('campgrounds/edit', { campground }); // renders the 'campground/edit' ejs view and pass campground to it.
  })
);

// Update campground
router.put(
  '/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body.campground;

    // Update the campground with specific ID
    const campground = await Campground.findOneAndUpdate(
      { _id: id }, // Filter criteria
      { ...data } // Updated data
    );

    req.flash('success', 'Successfully updated campground!'); // sets up a flash message with the type "success" in the req object
    res.redirect(`/campgrounds/${campground._id}`); // Go to the newly updated campground
  })
);

// Delete campground
router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;

    // Delete the campground with specific ID
    await Campground.findByIdAndDelete(id); // This will trigger the mongoose findOneAndDelete middleware

    req.flash('success', 'Successfully Deleted a campground!'); // sets up a flash message with the type "success" in the req object
    res.redirect(`/campgrounds`); // Go to the campgrounds
  })
);

module.exports = router;
