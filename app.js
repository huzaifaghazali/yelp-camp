// packages
const express = require('express');
const path = require('path');

const Campground = require('./models/campgrounds');

// mongoDB
const connectDB = require('./db/connect');

const app = express();

// sets the 'view engine' configuration for the 'app' object.
app.set('view engine', 'ejs'); // it means, that we'll use the ejs templating engine to render dynamic content.
// sets the 'views' configuration for the 'app' object
app.set('views', path.join(__dirname, 'views')); // views => ejs templates are located. path.join() -> join the current dir name with 'views' dir

app.use(express.urlencoded({ extended: true})); // URL-encoded data from the body of a POST request

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

app.post('/campgrounds', async (req, res) => {
  const data = req.body.campground;

  // Create a new campground
  const campground = new Campground(data);
  await campground.save();
  
  res.redirect(`/campgrounds/${campground._id}`) // Go to the newly created campground
});

app.get('/campgrounds/:id', async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById( id ); // Get the specific Campground
  res.render('campgrounds/show', { campground }); // renders the 'campground/show' ejs view and pass campground to it.
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
