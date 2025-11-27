const Listing = require("../models/listing");







// INDEX — Show all listings
module.exports.index = async (req, res, next) => {
  try {
    const allListings = await Listing.find({});

    console.log("✅ All listings page rendered successfully");

    return res.render("listings/index.ejs", {
      layout: "layouts/boilerplate",
      listings: allListings || []
    });

  } catch (error) {
    console.error("❌ Error fetching listings:", error);
    next(error);  // 👈 Correct way to pass error to Express handler
  }
};




//new form get
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
  console.log("New listing form rendered successfully");
}

//show listing
module.exports.showListing=async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({ path:"reviews", populate:{ path:"author" } })
        .populate('owner');

    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings'); // ✅ Use redirect and return
    }
    res.render('listings/show.ejs', { listing });
    console.log(listing);
    console.log("✅ Listing details page rendered successfully (with populated reviews)");

}



// // create listing post
// module.exports.createListing = async (req, res) => {
//   try {

//     const newListing = new Listing(req.body.listing);

//     // Agar image choose ki gayi but Cloudinary nahi hai → ignore
//     // req.file exists but no storage → do nothing

//     // Owner set
//     newListing.owner = req.user._id;

//     // Save to DB
//     await newListing.save();

//     req.flash('success', 'Successfully created a new listing!');
//     console.log("New listing created successfully");

//     res.redirect(`/listings/${newListing._id}`);

//   } catch (err) {
//     console.log("❌ Create listing error:", err);
//     req.flash("error", "Something went wrong.");
//     res.redirect("/listings/new");
//   }
// };




// create listing post
module.exports.createListing =async (req, res) => {

  let url=  req.file.path;
  let filename= req.file.filename;




    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {  url, filename };
    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect(`/listings/${newListing._id}`);

    console.log("New listing created successfully");
}







// edit form

module.exports.renderEditForm=async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings'); // ✅ Use redirect and return
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl.replace('/upload/', '/upload/h_300,w_250/');

    res.render('listings/edit.ejs', { listing });
    console.log("Edit page rendered successfully");
}

//update listing

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};



//delete listing

module.exports.destroyListing=async (req, res) => {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    if (!deletedListing) {
        throw new ExpressError(404, "Listing Not Found");
    }
    req.flash('success', 'Successfully  listing Deleted!');
    res.redirect('/listings');
    console.log("Listing deleted successfully");
}