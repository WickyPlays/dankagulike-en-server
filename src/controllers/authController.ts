import { Request, Response } from "express";

export const login = (req: Request, res: Response) => {
  //@ts-ignore
  if (req.user?.id) {
    res.redirect("/");
  } else {
    res.render("login");
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout(() => {
    res.redirect("/");
  });
};


export const googleCallback = (req: Request, res: Response) => {
  res.redirect("/");
};