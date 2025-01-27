import * as express from 'express';
import { registrationController } from "../controllers/registration.controller";
import rateLimit from 'express-rate-limit';

const registrationLimiter = rateLimit({
 windowMs: 60 * 60 * 1000, // 1 hour window
 max: 5, // limit each IP to 5 registration attempts per hour
 standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
 legacyHeaders: false, // Disable the `X-RateLimit-*` headers
 message: {
   status: 429,
   message: 'Too many registration attempts. Please try again after an hour.'
 },
 skipSuccessfulRequests: false, // Count successful registrations against the limit
});

const registrationRouter = express.Router();

registrationRouter.post("/register", registrationLimiter, registrationController);

export default registrationRouter;