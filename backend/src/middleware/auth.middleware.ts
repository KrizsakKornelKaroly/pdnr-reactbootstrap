import { Request, Response, NextFunction } from 'express';

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
};
