import express from "express";
import path from "path";
import passport from "passport";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes";
import contentRoutes from "./routes/contentRoutes";
import voteRoutes from "./routes/voteRoutes";
import likeRoutes from "./routes/likeRoutes";
import supportRoutes from "./routes/supportRoutes";
import profileRoutes from "./routes/profileRoutes";
import chartRoutes from "./routes/chartRoutes";
import { initializeDatabase } from "./utils/database";
dotenv.config();
import "./utils/passport"; 
import { authMiddleware } from "./middleware/authMiddleware";

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
app.use("/votes", voteRoutes);
app.use("/likes", likeRoutes);
app.use("/profile", authMiddleware, profileRoutes);

// Server Port
const EXPRESS_PORT = process.env.PORT || 3000;

app.listen(EXPRESS_PORT, () => {
  console.log("Server running on port", EXPRESS_PORT);
});
