require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// Import router
const router = require("./controller.js");

const app = express();
const port = process.env.PORT || 3000;

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Connect to MongoDB
const uri = process.env.MONGODB_URI;

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connected successfully."))
  .catch((err) => console.error("Error connecting to MongoDB:", err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// css and js file setup
app.use(express.static(path.join(__dirname, "public")));

// Use router
app.use(router);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
