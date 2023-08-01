// packages
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Campground = require('./models/campgrounds');

// mongoDB
const connectDB = require('./db/connect');

const app = express();

// sets the 'view engine' configuration for the 'app' object.
app.set('view engine', 'ejs'); // it means, that we'll use the ejs templating engine to render dynamic content.
// sets the 'views' configuration for the 'app' object
app.set('views', path.join(__dirname, 'views')); // views => ejs templates are located. path.join() -> join the current dir name with 'views' dir

const port = 3000;

app.get('/', (req, res) => {
  res.render('home'); // renders the 'home' view using the EJS templating
});

app.get('/makecampground', async (req, res) => {
  const camp = new Campground({
    title: 'My Backyard',
    description: 'cheap camping!',
  });
  await camp.save();
  res.send(camp);
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
