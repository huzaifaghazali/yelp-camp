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
const { isLoggedIn,isAuthor } = require('../middleware/authenticate');

// Get all the campgrounds
router.get('/', showCampgrounds);

// This route must be above the id route
// Authenticate the user then show form
router.get('/new', isLoggedIn, createCampgroundForm);

// Authenticate the user Check validations then Create Campground
router.post('/', isLoggedIn, validateCampground, createCampground);

// Authenticate the user Get the specific Campground
router.get('/:id', singleCampground);

// Authenticate the user then check permissions Then Get the specific Campground for edit(Edit form)
router.get('/:id/edit', isLoggedIn, isAuthor, editCampgroundForm);

// Authenticate the user then check permissions Check validations then Update campground
router.put('/:id', isLoggedIn, isAuthor, validateCampground, updateCampground);

// Authenticate the user then check permissions then Delete campground
router.delete('/:id', isLoggedIn, isAuthor, deleteCampground);

module.exports = router;
