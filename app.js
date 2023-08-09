// packages
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');

// Models
const Campground = require('./models/campgrounds');
const Review = require('./models/review');
const { campgroundSchema, reviewSchema } = require('./schemas');

// Routes 
const campgroundRoutes = require('./routes/campgrounds');

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

// Router middleware
app.use('/campgrounds', campgroundRoutes);

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

// Delete Review
app.delete(
  '/campgrounds/:id/reviews/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;

    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // remove the reviewId from the 'reviews' array of the specified campground.

    // Delete review
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`); // Go to the campground in which review is deleted
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
