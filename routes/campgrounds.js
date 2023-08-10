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

// Get all the campgrounds
router.get('/', showCampgrounds);

// This route must be above the id route
router.get('/new', createCampgroundForm);

// Check validations then Create Campground
router.post('/', validateCampground, createCampground);

// Get the specific Campground
router.get('/:id', singleCampground);

// Get the specific Campground for edit
router.get('/:id/edit', editCampgroundForm);

// Check validations then Update campground
router.put('/:id', validateCampground, updateCampground);

// Delete campground
router.delete('/:id', deleteCampground);

module.exports = router;
