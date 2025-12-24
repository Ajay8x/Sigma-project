const express = require("express");
const router = express.Router();
const passport = require("passport");
const { isAdmin } = require("../middleware");

const User = require("../models/user");
const Listing = require("../models/listing");
const Review = require("../models/review");


// ===============================
// 🔐 ADMIN LOGIN ROUTES
// ===============================

// Admin Login Page
router.get("/login", (req, res) => {
  res.render("admin/login");
});

// Admin Login Logic
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/admin/login",
    failureFlash: "Invalid credentials"
  }),
  (req, res) => {
    // ❗ Admin check
    if (!req.user.isAdmin) {
      req.logout(() => {});
      req.flash("error", "You are not an admin");
      return res.redirect("/admin/login");
    }

    req.flash("success", "Welcome Admin!");
    res.redirect("/admin/dashboard");
  }
);

// Admin Logout
router.get("/logout", (req, res) => {
  req.logout(() => {
    req.flash("success", "Admin logged out");
    res.redirect("/admin/login");
  });
});


// ===============================
// 🛠 ADMIN DASHBOARD
// ===============================

router.get("/dashboard", isAdmin, async (req, res) => {
  const users = await User.find({});
  const listings = await Listing.find({});
  const reviews = await Review.find({});

  // 🔢 Analytics counts
  const totalUsers = users.length;
  const totalListings = listings.length;
  const totalReviews = reviews.length;
  const totalAdmins = users.filter(u => u.isAdmin).length;

  res.render("admin/dashboard", {
    users,
    listings,
    reviews,
    totalUsers,
    totalListings,
    totalReviews,
    totalAdmins
  });
});


// ===============================
// ❌ ADMIN ACTIONS
// ===============================

// Delete any listing
router.delete("/listings/:id", isAdmin, async (req, res) => {
  await Listing.findByIdAndDelete(req.params.id);
  req.flash("success", "Listing deleted by admin");
  res.redirect("/admin/dashboard");
});

// Delete any user (except admin)
router.delete("/users/:id", isAdmin, async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user.isAdmin) {
    req.flash("error", "Cannot delete admin");
    return res.redirect("/admin/dashboard");
  }

  await User.findByIdAndDelete(req.params.id);
  req.flash("success", "User deleted");
  res.redirect("/admin/dashboard");
});

module.exports = router;
