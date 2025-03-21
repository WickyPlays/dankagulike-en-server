const express = require("express");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.cjs");
const contentRoutes = require("./routes/contentRoutes.cjs");
const likeRoutes = require("./routes/likeRoutes.cjs");
const supportRoutes = require("./routes/supportRoutes.cjs");
const profileRoutes = require("./routes/profileRoutes.cjs");
const chartRoutes = require("./routes/chartRoutes.cjs");
const { initializeDatabase } = require("./utils/database.cjs");
dotenv.config();
require("./utils/passport.cjs"); 
const { authMiddleware } = require("./middleware/authMiddleware.cjs");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

initializeDatabase();

const SQLiteStore = require("connect-sqlite3")(session);

app.use(
  session({
    store: new SQLiteStore({
      db: "charts.db",
      dir: "./.data",
      table: "sessions",
    }),
    secret: process.env.JWT_SECRET || "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", contentRoutes);
app.use("/support", supportRoutes);
app.use("/auth", authRoutes);
app.use('/charts', chartRoutes);
app.use("/likes", likeRoutes);
app.use("/profile", authMiddleware, profileRoutes);

// Server Port
const EXPRESS_PORT = process.env.PORT || 3000;

app.listen(EXPRESS_PORT, () => {
  console.log("Server running on port", EXPRESS_PORT);
});

