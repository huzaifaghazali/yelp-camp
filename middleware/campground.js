const { campgroundSchema, reviewSchema } = require('../schemas');

// Errors
const ExpressError = require('../utils/ExpressError');

// Joi validation campground middleware
module.exports.validateCampground = (req, res, next) => {
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

 module.exports.validateReview = (req, res, next) => {
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
