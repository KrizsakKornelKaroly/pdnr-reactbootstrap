import e, { Request, Response } from "express";

export const checkAuthController = (req: Request, res: Response) => {
  res.status(200).json({
    isAuth: true,
    userData: {
      icName: req.session.ic_name,
      userId: req.session.user_id,
      userLevel: req.session.userLevel,
      email: req.session.email,
      dc_name: req.session.dc_name,
      expiresAt: req.session.cookie.expires,
    },
  });
};
