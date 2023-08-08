// packages
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

// Models
const Campground = require('./models/campgrounds');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas');

// mongoDB
const connectDB = require('./db/connect');

// Errors
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');

const app = express();

app.engine('ejs', ejsMate); // setting template engine for rendering EJS templates
// sets the 'view engine' and 'views' configuration for the 'app' object.
app.set('view engine', 'ejs'); // it means, that we'll use the ejs templating engine to render dynamic content.
app.set('views', path.join(__dirname, 'views')); // views => ejs templates are located. path.join() -> join the current dir name with 'views' dir

// Middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded data from the body of a POST request
app.use(methodOverride('_method')); // Used to override the HTTP methods e.g URLs like /route?_method=PUT.

const port = 3000;

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

// Joi validation review middleware
const validateReview = (req, res, next) => {
  // validation the data as described in validation schema
  const { error } = reviewSchema.validate(req.body);

  if (error) {
    // Throw the error if data is invalid
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next(); // Go to the next middleware function
  }
};

app.get('/', (req, res) => {
  res.render('home'); // renders the 'home' view using the EJS templating
});

// Get all the campgrounds
app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({}); // Get all the Campgrounds
  res.render('campgrounds/index', { campgrounds }); // renders the 'campground/index' ejs view and pass campgrounds to it.
});

// This route must be above the id route
app.get('/campgrounds/new', async (req, res) => {
  res.render('campgrounds/new'); // renders the 'campground/new' form ejs view
});

// Create Campground
app.post(
  '/campgrounds',
  validateCampground,
  catchAsync(async (req, res, next) => {
    // Throw error if data doesn't exist then catchAsync will catch it and pass it to middleware.
    if (!req.body.campground)
      throw new ExpressError('Invalid Campground data', 400);

    const data = req.body.campground;

    // Create a new campground
    const campground = new Campground(data);
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`); // Go to the newly created campground
  })
);

// Get the specific Campground
app.get(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Get the specific Campground
    res.render('campgrounds/show', { campground }); // renders the 'campground/show' ejs view and pass campground to it.
  })
);

// Get the specific Campground for edit
app.get(
  '/campgrounds/:id/edit',
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id); // Get the specific Campground
    res.render('campgrounds/edit', { campground }); // renders the 'campground/edit' ejs view and pass campground to it.
  })
);

// Update campground
app.put(
  '/campgrounds/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const data = req.body.campground;

    // Update the campground with specific ID
    const campground = await Campground.findOneAndUpdate(
      { _id: id }, // Filter criteria
      { ...data } // Updated data
    );

    res.redirect(`/campgrounds/${campground._id}`); // Go to the newly updated campground
  })
);

// Delete campground
app.delete(
  '/campgrounds/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params;

    // Delete the campground with specific ID
    await Campground.findByIdAndDelete(id);

    res.redirect(`/campgrounds`); // Go to the campgrounds
  })
);

// Create Review
app.post(
  '/campgrounds/:id/reviews',
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

    res.redirect(`/campgrounds/${campground._id}`); // Go to the campground in which review is created
  })
);

// For every request and path. This will only run if the none of the above requests run
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404)); // Go the next middleware function. In that case it will go to the error middlware
});

//  middleware function handle errors.
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err; // From ExpressError Class
  if (!err.message) err.message = 'Oh No, Something Went Wrong!';
  res.status(statusCode).render('error', { err }); // renders the 'error' ejs view and pass error to it.
});

const start = async () => {
  try {
    await connectDB();
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
