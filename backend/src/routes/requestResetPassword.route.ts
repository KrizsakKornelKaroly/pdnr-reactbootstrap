import * as express from 'express';
import { requestPasswordResetController } from '../controllers/requestPasswordReset.controller';

const requestPasswordResetRoute = express.Router();

requestPasswordResetRoute.post("/request-password-reset", requestPasswordResetController);

export default requestPasswordResetRoute;