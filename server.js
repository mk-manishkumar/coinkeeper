require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

// Import router
const router = require("./controllers/controller.js");

const app = express();
const port = process.env.PORT || 3000;

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

// Parse URL-encoded and JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Use router
app.use(router);

app.get("/", (req, res) => {
  res.render("login");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
