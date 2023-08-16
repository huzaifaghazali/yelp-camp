const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  images: [
    {
      url: String,
      filename: String
    }
  ],
  price: Number,
  description: String,
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  // Each One Campground has many reviews. Each Campground object can have an array of Review references
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review' // Reference to the review model 
    }
  ]
});

// ***** mongoose Middleware ***** 
// This method is used to delete the reviews when campground is deleted
CampgroundSchema.post('findOneAndDelete', async function(doc) {
  // If document is deleted
  if(doc) {
    // Delete all reviews where there ID is in doc.reviews
    await Review.deleteMany({
      _id: {
        $in: doc.reviews
      }
    })
  }
})

module.exports = mongoose.model('Campground', CampgroundSchema);
