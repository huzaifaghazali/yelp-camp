// packages
const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Routes
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

// mongoDB
const connectDB = require('./db/connect');

// Model
const User = require('./models/user');

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
  name: 'session',
  secret: 'sessionsecret',
  resave: false, // to save the session data
  saveUninitialized: true, //  to save sessions that are new and haven't been modified.
  coookie: {
    httpOnly: true, // restricts access to the session cookie only through the HTTP
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig)); // Set the express session middleware
app.use(flash()); // Set the flash middleware
app.use(passport.initialize()); // initializes Passport and sets it up to work application.
app.use(passport.session()); // enables Passport to manage user sessions, allowing you to keep track of authenticated users across requests.
app.use(
  mongoSanitize({
    replaceWith: '_', // characters that might be used in a malicious query will be replaced with underscores
  })
); // to stop the mongo injection
app.use(helmet());

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',
  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net',
];
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
  'https://cdn.jsdelivr.net',
  'https://cdnjs.cloudflare.com/'
];
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
];
const fontSrcUrls = [];

app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/dk8czslcw/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
      manifestSrc: ["'self'"],
    },
  })
);

// sets up a local authentication strategy
passport.use(new LocalStrategy(User.authenticate())); // User.authenticate() is a method provided by passport-local-mongoose
// configures the serialization(saving it to session) and deserialization(from the session) of user data

// User.serializeUser() & User.deserializeUser() are methods provided by passport-local-mongoose
passport.serializeUser(User.serializeUser()); // determines which data to store in the session to identify the user.
passport.deserializeUser(User.deserializeUser()); // retrieves user data from the session based on the serialized user data.

app.use((req, res, next) => {
  // The res.locals object is a way to pass data from the server to the view template. Three properties ( currentUser, success and error) are added to the res.locals
  res.locals.currentUser = req.user; // req.user object is typically set by Passport.js after a user is authenticated. It represents the currently authenticated user.
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
app.use('/', userRoutes);

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
