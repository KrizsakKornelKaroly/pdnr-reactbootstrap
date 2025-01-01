import { Router } from 'express';
import { checkAuth } from '../middleware/auth.middleware';
import { checkAuthController } from '../controllers/checkAuth.controller';

const protectedRoute = Router();

protectedRoute.get('/check-auth', checkAuth, checkAuthController);

export default protectedRoute;
