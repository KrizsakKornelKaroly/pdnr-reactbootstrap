import { Request, Response, NextFunction } from 'express';

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session && req.session.user_id) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session && req.session.userLevel === 'admin') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};
