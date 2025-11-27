const User = require("../models/user");




// ✅ Render signup form
module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup");
};



// ✅ Signup controller
module.exports.signup = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;

    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);

    // Automatically log in the new user
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Signup Successfully!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};


//  Render login form
module.exports.renderLoginForm = (req, res) => {
  res.render("users/login");
};



//  Handle login
module.exports.login = async (req, res) => {
    req.flash('success', 'Welcome Back! you have successfully logged in');

    let redirectUrl = res.locals.redirectUrl || '/listings';  // ✅ Use stored URL or fallback
    // delete req.session.redirectUrl; // ✅ Clear after use
    return res.redirect(redirectUrl);
  };








//  Handle logout
module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.flash("success", "You have logged out successfully!");
    res.redirect("/listings");
  });
};


