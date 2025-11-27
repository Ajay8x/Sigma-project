const express = require('express');
const router = express.Router();
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');
const {saveRedirectUrl} = require('../middleware.js');
const user = require('../models/user');

userController = require('../controllers/users.js');


router.route('/signup')
.get( userController.renderSignupForm)// SIGNUP FORM
.post( wrapAsync(userController.signup)); // SIGNUP post





router
.route('/login')
.get(userController.renderLoginForm)// LOGIN FORM
.post( saveRedirectUrl,
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
  }),
  userController.login
);// LOGIN LOGIC




// LOGOUT ROUTE
router.get('/logout', userController.logout); 





module.exports = router;
