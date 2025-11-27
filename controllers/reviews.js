const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Ensure listing exists
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }

    // 2️⃣ Create review
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();

    // 3️⃣ Add review reference without revalidating listing
    await Listing.findByIdAndUpdate(id, { $push: { reviews: newReview._id } });

    req.flash("success", "Successfully created review!");
    console.log("✅ New review added to listing:", id);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("⚠️ Error creating review:", err);
    req.flash("error", "Something went wrong while creating review.");
    res.redirect("/listings");
  }
};



//delete reviews
module.exports.destroyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash('success', 'Successfully deleted review!');
    console.log(`🗑️ Review ${reviewId} deleted from listing ${id}`);
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error("⚠️ Error deleting review:", err);
    req.flash('error', 'Something went wrong while deleting review.');
    res.redirect(`/listings/${id}`);
  }
};
