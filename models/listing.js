const mongoose = require("mongoose");
const Review = require("./review"); // ✅ Model reference
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,

  // image: {
  //   type: String,
  //   default:
  //     "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60",
  //   set: (v) =>
  //     v === ""
  //       ? "https://images.unsplash.com/photo-1586375300773-8384e3e4916f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"
  //       : v,
  // },


    image: {
    url: String,
    filename: String,
  },

  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // ✅ Proper reference
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

// ✅ Mongoose middleware: Delete all associated reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({
      _id: { $in: listing.reviews },
    });
    console.log("🗑️ Deleted associated reviews:", listing.reviews);
  }
});

// ✅ Create Model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
