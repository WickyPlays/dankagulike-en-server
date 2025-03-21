const express = require("express");
const passport = require("passport");
const { login, logout, googleCallback } = require("../controllers/authController.cjs");

const router = express.Router();

router.get("/login", login);
router.get("/logout", logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/login" }), googleCallback);

module.exports = router;
