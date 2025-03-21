import { Request, Response, NextFunction } from "express";
import passport from "passport";

const isAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.redirect("/auth/login?returnUrl=" + encodeURIComponent(req.originalUrl));
    }
    req.user = user;
    next();
  })(req, res, next);
};

export default isAuthenticated;
