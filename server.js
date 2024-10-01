import "dotenv/config";
import express from "express";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import router from "./controllers/controller.js";

const app = express();
const port = process.env.PORT || 3000;

// connect dB
import connectDB from "./config/db.js";
connectDB();

// Get the current directory for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
