import express from 'express';
import { logoutController } from '../controllers/logout.controller';
import { checkAuth } from '../middleware/auth.middleware';

const logoutRoute = express.Router();

logoutRoute.post('/logout', checkAuth, (req, res, next) => {
  console.log('Logout route hit');
  next();
}, logoutController);

export default logoutRoute;
