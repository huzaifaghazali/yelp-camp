const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
  location: String,
  // Each One Campground has many reviews. Each Campground object can have an array of Review references
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review' // Reference to the review model 
    }
  ]
});

module.exports = mongoose.model('Campground', CampgroundSchema);
