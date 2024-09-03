import { Router } from 'express';
import loginRouter from './login.route';
import registrationRouter from './register.route';
import logoutRoute from './logout.route';
import protectedRoute from './protected.route';
import resetPasswordRoute from './resetPassword.route';
import requestPasswordResetRoute from './requestResetPassword.route';

const router = Router();

router.use(loginRouter);
router.use(registrationRouter);
router.use(logoutRoute);
router.use(protectedRoute);
router.use(resetPasswordRoute)
router.use(requestPasswordResetRoute)

export default router;
