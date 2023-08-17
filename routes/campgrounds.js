// Packages
const express = require('express');
const router = express.Router();
const multer = require('multer'); // handling multipart/form-data,

const { storage } = require('../cloudinary');
const upload = multer({ storage }); // destination in which files are uploaded

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
const { isLoggedIn, isAuthor } = require('../middleware/authenticate');

// Multer adds a body object and a file or files object to the request object.

router
  .route('/')
  .get(showCampgrounds) // Get all the campgrounds
  .post(
    isLoggedIn,
    upload.array('image'),
    validateCampground,
    createCampground
  ); // Authenticate the user Check validations then Create Campground

// This route must be above the id route
// Authenticate the user then show form
router.get('/new', isLoggedIn, createCampgroundForm);

router
  .route('/:id')
  .get(singleCampground) // Authenticate the user Get the specific Campground
  .put(
    isLoggedIn,
    isAuthor,
    upload.array('image'),
    validateCampground,
    updateCampground
  ) // Authenticate the user then check permissions Check validations then Update campground
  .delete(isLoggedIn, isAuthor, deleteCampground); // Authenticate the user then check permissions then Delete campground

// Authenticate the user then check permissions Then Get the specific Campground for edit(Edit form)
router.get('/:id/edit', isLoggedIn, isAuthor, editCampgroundForm);

module.exports = router;
