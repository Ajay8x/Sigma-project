const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError.js');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// Routes imports
const listingsRouter = require('./routes/listing.js');
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');
const { error } = require('console');


// MongoDB connection
//const MONGO_URI = 'mongodb://localhost:27017/wanderlust';
const dbUrl=process.env.ATLASDB_URL;
main()
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

// Middleware
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));


 
const store = MongoStore.create({
  mongoUrl: dbUrl,
  collectionName: "sessions",
  ttl: 14 * 24 * 60 * 60  // 14 days
});



store.on("error", (err) => {
  console.log("SESSION STORE ERROR", err);
});


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,   // 🔥 MUST BE FALSE
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  },
};



// // Routes /
// app.get('/', (req, res) => {
//   res.render('home');
//   console.log('🏠 Home page rendered successfully');
// });


// Session Configuration
app.use(session(sessionOptions));
app.use(flash());



// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());







// Flash Middleware 
app.use((req, res, next) => {
  res.locals.success=req.flash('success');
  res.locals.error=req.flash('error');
  res.locals.currUser=req.user;
 
  next();
});

app.get('/demouser', async (req, res) => {
  try {
    let user = new User({
      username: "delta-student",
      email: "student@gmail.com"
    });

    let registeredUser = await User.register(user, "helloworld");
    res.send(registeredUser);
    
  } catch (err) {
    console.log(err);
    res.status(500).send("Error: " + err.message);
  }
});











//use route 

// Listings routes
app.use('/listings', listingsRouter);
// Reviews routes
app.use('/listings/:id/reviews', reviewsRouter);
//user routes
app.use('/', userRouter);




///// ERROR HANDLING /////

// 404 handler (for unmatched routes) / global handler
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

// General error handler
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something went wrong!';

  // ✅ Set correct status
  res.status(statusCode);

  // For JSON requests (like Postman/Hoppscotch)
  if (req.headers.accept?.includes('application/json')) {
    return res.json({ error: err.message, statusCode });
  }

  // Otherwise, render EJS error page
  res.render('error.ejs', { err });

  console.error(`⚠️ Error (${statusCode}): ${err.message}`);
});






        // Start the server
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
















