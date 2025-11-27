
if (process.env.NODE_ENV !== "production"){
    require('dotenv').config();
}



// console.log(process.env);

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner } = require('../middleware.js');
const { validateListing } = require('../middleware.js');
const listingController = require('../controllers/listings.js');




const multer  = require('multer')
const { storage } = require('../cloudConfig.js');
const fs = require("fs");
const upload = multer({ storage  })








router
    .route("/")  
       .get(wrapAsync(listingController.index))// All index Listings
       .post(isLoggedIn,
        upload.single('listing[image]'),
        validateListing,
         wrapAsync(listingController.createListing));// Create Listing






router.get('/new', isLoggedIn, listingController.renderNewForm);// New Listing Form






router
    .route("/:id")
    .get(wrapAsync(listingController.showListing))// Show Listing by ID (with populated reviews)
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))// Update Listing
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));// Delete Listing







router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));// Edit Form







module.exports = router;