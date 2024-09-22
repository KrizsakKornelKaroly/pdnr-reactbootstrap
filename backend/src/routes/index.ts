import { Router } from 'express';
import loginRouter from './login.route';
import registrationRouter from './register.route';
import logoutRoute from './logout.route';
import protectedRoute from './protected.route';
import resetPasswordRoute from './resetPassword.route';
import requestPasswordResetRoute from './requestResetPassword.route';
import rateLimit from 'express-rate-limit';
import startDutyRoute from './startDuty.route';
import resetPasswordRouter from './resetPassword.route';
import requestPasswordResetRouter from './requestResetPassword.route';
import stopDutyRoute from './stopDuty.route';

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes.',
});

// Rate limit specifically for authentication routes (login, register, password reset)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 10 requests per windowMs for these routes
  message: 'Too many authentication attempts, please try again after 15 minutes.',
});

const router = Router();

router.use(authLimiter, loginRouter);
router.use(authLimiter, registrationRouter);
router.use(logoutRoute);
router.use(protectedRoute);
router.use(authLimiter, resetPasswordRouter)
router.use(authLimiter, requestPasswordResetRouter)
router.use(startDutyRoute);
router.use(stopDutyRoute);


export default router;
