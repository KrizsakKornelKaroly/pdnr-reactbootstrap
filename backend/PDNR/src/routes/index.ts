import { Router } from 'express';
import loginRouter from './login.route';
import registrationRouter from './register.route';
import logoutRoute from './logout.route';
import protectedRoute from './protected.route';
import startDutyRoute from './startDuty.route';
import resetPasswordRouter from './resetPassword.route';
import requestPasswordResetRouter from './requestResetPassword.route';
import stopDutyRoute from './stopDuty.route';
import { getLastEndedDuty } from '../controllers/getLastEndedDuty.controller';

const router = Router();

router.use(loginRouter);
router.use(registrationRouter);
router.use(logoutRoute);
router.use(protectedRoute);
router.use(resetPasswordRouter)
router.use(requestPasswordResetRouter)
router.use(startDutyRoute);
router.use(stopDutyRoute);
router.use(getLastEndedDuty);


export default router;
