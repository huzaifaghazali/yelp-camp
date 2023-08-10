// Packages
const express = require('express');
const router = express.Router();

// Controllers
const {
  showCampgrounds,
  createCampgroundForm,
  createCampground,
  singleCampground,
  editCampgroundForm,
  updateCampground,
  deleteCampground,
} = require('../controllers/campground');

// Middleware
const { validateCampground } = require('../middleware/campground');
const { isLoggedIn } = require('../middleware/authenticate');

// Get all the campgrounds
router.get('/', showCampgrounds);

// This route must be above the id route
// Authenticate the user then show form
router.get('/new', isLoggedIn, createCampgroundForm);

// Authenticate the user Check validations then Create Campground
router.post('/', isLoggedIn, validateCampground, createCampground);

// Authenticate the user Get the specific Campground
router.get('/:id', singleCampground);

// Get the specific Campground for edit
router.get('/:id/edit', isLoggedIn, editCampgroundForm);

// Check validations then Update campground
router.put('/:id', isLoggedIn, validateCampground, updateCampground);

// Delete campground
router.delete('/:id', isLoggedIn, deleteCampground);

module.exports = router;
