const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { cloudinary } = require('../cloudinary');
// Model
const Campground = require('../models/campgrounds');

// Errors
const catchAsync = require('../utils/catchAsync');

// Mapbox
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken }); // initializes a geocoder instance

// Get all the campgrounds
const showCampgrounds = async (req, res) => {

  const searchQuery = req.query.search || ''; // Default to empty string if search query is not provided

  const campgrounds = await Campground.find({ title: { $regex: new RegExp(searchQuery, 'i') } });

  res.render('campgrounds/index', { campgrounds, searchQuery });

  // const campgrounds = await Campground.find({}); // Get all the Campgrounds
  // res.render('campgrounds/index', { campgrounds }); // renders the 'campground/index' ejs view and pass campgrounds to it.
};

// Show the new campground form
const createCampgroundForm = async (req, res) => {
  res.render('campgrounds/new'); // renders the 'campground/new' form ejs view
};

// create campground
const createCampground = catchAsync(async (req, res, next) => {
  // Throw error if data doesn't exist then catchAsync will catch it and pass it to middleware.
  if (!req.body.campground)
    throw new ExpressError('Invalid Campground data', 400);

  const data = req.body.campground;

  // forward geocoding request to Mapbox's Geocoding API.
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();

  // Create a new campground
  const campground = new Campground(data);
  campground.geometry = geoData.body.features[0].geometry; // store the latitude and longitude
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); // Store the image path and filename from cloudinary
  campground.author = req.user._id; // Associate the newly created campground with logged user
  await campground.save();
  req.flash('success', 'Successfully made a new campground!'); // sets up a flash message with the type "success" in the req object
  res.redirect(`/campgrounds/${campground._id}`); // Go to the newly created campground
});

// Get Single Campground
const singleCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
      },
    })
    .populate('author');
  // Get the specific Campground and add reviews that are associated with it and author who created the campground.

  // If there is no campground
  if (!campground) {
    req.flash('error', 'Cannot find that campground'); // sets up a flash message with the type "error" in the req object
    return res.redirect(`/campgrounds/`); // Go campground
  }
  res.render('campgrounds/show', { campground }); // renders the 'campground/show' ejs view and pass campground to it.
});

// Show the edit campground form
const editCampgroundForm = catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id); // Get the specific Campground

  // If there is no campground
  if (!campground) {
    req.flash('error', 'Cannot find that campground'); // sets up a flash message with the type "error" in the req object
    return res.redirect(`/campgrounds/`); // Go campground
  }

  res.render('campgrounds/edit', { campground }); // renders the 'campground/edit' ejs view and pass campground to it.
});

// Update the campground
const updateCampground = catchAsync(async (req, res) => {
  const { id } = req.params;
  const data = req.body.campground;

  // Update the campground with specific ID
  const campground = await Campground.findOneAndUpdate(
    { _id: id }, // Filter criteria
    { ...data } // Updated data
  );

  const imgs = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  })); // Store the image path and filename from cloudinary
  campground.images.push(...imgs); // adds the newly uploaded images to the existing collection of images associated with the campground.

  // Delete Images from DB and cloudinary
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }

    // $pull remove specific elements from the images array of the campground document.
    // $in(select) elements with filename values matching any value in the req.body.deleteImages
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  await campground.save();

  req.flash('success', 'Successfully updated campground!'); // sets up a flash message with the type "success" in the req object
  res.redirect(`/campgrounds/${campground._id}`); // Go to the newly updated campground
});

// Delete the campground
const deleteCampground = catchAsync(async (req, res) => {
  const { id } = req.params;

  // Delete the campground with specific ID
  await Campground.findByIdAndDelete(id); // This will trigger the mongoose findOneAndDelete middleware

  req.flash('success', 'Successfully Deleted a campground!'); // sets up a flash message with the type "success" in the req object
  res.redirect(`/campgrounds`); // Go to the campgrounds
});

module.exports = {
  showCampgrounds,
  createCampgroundForm,
  createCampground,
  singleCampground,
  editCampgroundForm,
  updateCampground,
  deleteCampground,
};
