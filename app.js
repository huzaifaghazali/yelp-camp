// packages
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

// mongoDB
const connectDB = require('./db/connect');

// Errors
const ExpressError = require('./utils/ExpressError');

const app = express();

app.engine('ejs', ejsMate); // setting template engine for rendering EJS templates
// sets the 'view engine' and 'views' configuration for the 'app' object.
app.set('view engine', 'ejs'); // it means, that we'll use the ejs templating engine to render dynamic content.
app.set('views', path.join(__dirname, 'views')); // views => ejs templates are located. path.join() -> join the current dir name with 'views' dir

// Middleware
app.use(express.urlencoded({ extended: true })); // URL-encoded data from the body of a POST request
app.use(methodOverride('_method')); // Used to override the HTTP methods e.g URLs like /route?_method=PUT.
app.use(express.static(path.join(__dirname, 'public'))); //  serving static files from a directory to the client's browser
const sessionConfig = {
  secret: 'sessionsecret',
  resave: false, // to save the session data
  saveUninitialized: true, //  to save sessions that are new and haven't been modified.
  coookie: {
    httpOnly: true, // estricts access to the session cookie only through the HTTP
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig)); // Set the express session middleware
app.use(flash()); // Set the flash middleware

app.use((req, res, next) => {
  // The res.locals object is a way to pass data from the server to the view template. Two properties (success and error) are added to the res.locals
  res.locals.success = req.flash('success'); // takes any "success" flash messages stored in the request (if any) and assigns them to the success property
  res.locals.error = req.flash('error'); // takes any "error" flash messages stored in the request (if any) and assigns them to the error property
  next();
});

const port = 3000;

app.get('/', (req, res) => {
  res.render('home'); // renders the 'home' view using the EJS templating
});

// Router middleware
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

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
