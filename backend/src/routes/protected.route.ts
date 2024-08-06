import * as express from 'express';
import { checkAuth } from '../middleware/auth.middleware';
import { checkAuthController } from '../controllers/checkAuth.controller';


const protectedRoute = express.Router();

protectedRoute.get('/check-auth', checkAuth, (req, res, next) => {
  next();
}, checkAuthController);

export default protectedRoute;