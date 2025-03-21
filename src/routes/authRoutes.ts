import express from "express";
import passport from "passport";
import { login, logout, googleCallback } from "../controllers/authController";

const router = express.Router();

router.get("/login", login);
router.get("/logout", logout);
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/auth/login" }), googleCallback);

export default router;