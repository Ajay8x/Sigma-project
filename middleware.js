  
const Listing = require('./models/listing.js');
const Review = require('./models/review.js');
const ExpressError = require('./utils/ExpressError.js');
const { listingSchema,reviewSchema } = require('./schema.js');







  module.exports.isLoggedIn = (req, res, next) => {
    console.log(req.path,"...",req.originalUrl);
    if (!req.isAuthenticated()) {
     
      req.session.redirectUrl = req.originalUrl; // Store the original URL to redirect after login
        req.flash('error', 'You must be signed in to access');
        return res.redirect('/login');
    } 
    next();
}


// Middleware to save redirect URL to res.locals
module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  } 
  // else {
  //   res.locals.redirectUrl = '/listings';
  // } 
  next();
}

// listing Middleware to clear redirect URL from session after redirecting

module.exports.isOwner = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing.owner.equals(req.user._id)) {
      req.flash('error', 'You are not the owner, so you cannot perform this action.');
      return res.redirect(`/listings/${id}`);
  } 
      next();
};



// Validation Middleware

 module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// Review Validation Middleware
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map(el => el.message).join(", ");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};



//  Middleware to clear redirect URL from session after redirecting

module.exports.isReviewAuthor= async (req, res, next) => {
  const {id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
      req.flash('error', 'You are not the owner, so you cannot perform this action.');
      return res.redirect(`/listings/${id}`);
  } 
      next();
};
