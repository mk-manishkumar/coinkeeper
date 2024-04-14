require("dotenv").config();
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const amountModel = require("./models/amount.model.js");
const app = express();
const port = process.env.PORT || 3000;

// Configure body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// css and js file setup
app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
