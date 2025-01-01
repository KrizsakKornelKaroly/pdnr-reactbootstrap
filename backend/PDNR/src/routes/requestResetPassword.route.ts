import * as express from 'express';
import { requestPasswordResetController } from '../controllers/requestPasswordReset.controller';

const requestPasswordResetRouter = express.Router();

requestPasswordResetRouter.post("/request-password-reset", requestPasswordResetController);

export default requestPasswordResetRouter;