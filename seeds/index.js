const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campgrounds');

const connectDB = require('../db/connect');

// This code is used to seed the database

// This function will return random element from an array
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  try {
    // Delete all the campgrounds
    await Campground.deleteMany({});

    // Create 50 campgrounds
    for (let i = 0; i < 50; i++) {
      // Generate the random number b/w 0 to 999
      const random1000 = Math.floor(Math.random() * 1000);

      // Create a new campground
      const camp = new Campground({
        location: `${cities[random1000].city}, ${cities[random1000].state}`,
        title: `${sample(descriptors)} ${sample(places)}`,
      });
      await camp.save();
    }

    await mongoose.connection.close();
  } catch (error) {
    console.log('Error while seeding the database:', error);
  }
};

const start = async () => {
  try {
    await connectDB();
    seedDB();
  } catch (error) {
    console.log(error);
  }
};

start();
