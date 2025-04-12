import { Request, Response, NextFunction } from 'express';

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('Session data:', req.session); 
  if (req.session && req.session.user_id) {
    console.log('User is authenticated: ', req.session.user_id);
    return next();
  } else {
    console.log('User is not authenticated');
    res.status(401).json({ isAuth: false, success: false, message: 'Unauthorized', error: 'SESSION_EXPIRED', code: 'SESSION_EXPIRED' });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session && req.session.userLevel === 'admin') {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
};
