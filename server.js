import "dotenv/config";
import express from "express";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import { fileURLToPath } from "url";
import session from "express-session";
import flash from "connect-flash";
import bodyParser from "body-parser";

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

// setup bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Setup session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 },
  })
);

// Setup flash middleware
app.use(flash());

// import routes
import authRouter from "./routes/authRoutes.js";
import profileRouter from "./routes/profileRoutes.js";

// Use router
app.use("/", authRouter);
app.use("/profile", profileRouter);

// Handle 404 errors (not found)
app.use((req, res, next) => {
  res.status(404).render("404", { message: "Page not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

app.listen(port, () => console.log(`App listening on port ${port}`));
