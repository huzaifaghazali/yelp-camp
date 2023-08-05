// packages
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
// Models
const Campground = require('./models/campgrounds');

// mongoDB
const connectDB = require('./db/connect');

const app = express();

app.engine('ejs', ejsMate); // setting template engine for rendering EJS templates
// sets the 'view engine' and 'views' configuration for the 'app' object.
app.set('view engine', 'ejs'); // it means, that we'll use the ejs templating engine to render dynamic content.
app.set('views', path.join(__dirname, 'views')); // views => ejs templates are located. path.join() -> join the current dir name with 'views' dir

// Middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded data from the body of a POST request
app.use(methodOverride('_method')); // Used to override the HTTP methods e.g URLs like /route?_method=PUT.

const port = 3000;

app.get('/', (req, res) => {
  res.render('home'); // renders the 'home' view using the EJS templating
});

app.get('/campgrounds', async (req, res) => {
  const campgrounds = await Campground.find({}); // Get all the Campgrounds
  res.render('campgrounds/index', { campgrounds }); // renders the 'campground/index' ejs view and pass campgrounds to it.
});

// This route must be above the id route
app.get('/campgrounds/new', async (req, res) => {
  res.render('campgrounds/new'); // renders the 'campground/new' form ejs view
});

app.post('/campgrounds', async (req, res, next) => {
  try {
    const data = req.body.campground;

    // Create a new campground
    const campground = new Campground(data);
    await campground.save();
  
    res.redirect(`/campgrounds/${campground._id}`); // Go to the newly created campground
  } catch (error) {
    next(error)
  }
});

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id); // Get the specific Campground
  res.render('campgrounds/show', { campground }); // renders the 'campground/show' ejs view and pass campground to it.
});

app.get('/campgrounds/:id/edit', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id); // Get the specific Campground
  res.render('campgrounds/edit', { campground }); // renders the 'campground/edit' ejs view and pass campground to it.
});

app.put('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const data = req.body.campground;

  // Update the campground with specific ID
  const campground = await Campground.findOneAndUpdate(
    { _id: id }, // Filter criteria
    { ...data } // Updated data
  );

  res.redirect(`/campgrounds/${campground._id}`); // Go to the newly updated campground
});

app.delete('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;

  // Delete the campground with specific ID
  await Campground.findByIdAndDelete(id);

  res.redirect(`/campgrounds`); // Go to the campgrounds
});

app.use((err, req, res, next) => {
  res.send('Something went wrong')
})

const start = async () => {
  try {
    await connectDB();
    app.listen(port, console.log(`Server is listening on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
