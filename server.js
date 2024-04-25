require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

// Import router
const router = require("./controllers/controller.js");

const app = express();
const port = process.env.PORT || 3000;
const secretKey = process.env.SECRET_KEY;

// Configure session and flash messages
app.use(
  session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// Configure Passport Local Strategy
const userModel = require("./models/user.model");
const bcrypt = require("bcrypt");

passport.use(
  new LocalStrategy(function (username, password, done) {
    userModel.findOne({ username: username }, function (err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { message: "User not found" });
      }
      bcrypt.compare(password, user.password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  userModel.findById(id, function (err, user) {
    done(err, user);
  });
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// css and js file setup
app.use(express.static(path.join(__dirname, "public")));

// Use router
app.use(router);

app.get("/", (req, res) => {
  res.render("login");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
