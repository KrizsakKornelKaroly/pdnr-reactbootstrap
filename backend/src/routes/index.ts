import { Router } from 'express';
import loginRouter from './login.route';
import registrationRouter from './register.route';
import logoutRoute from './logout.route';
import protectedRoute from './protected.route';

const router = Router();

router.use(loginRouter);
router.use(registrationRouter);
router.use(logoutRoute);
router.use(protectedRoute);

export default router;
