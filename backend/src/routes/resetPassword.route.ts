import * as express from 'express';
import { resetPasswordController } from '../controllers/resetPassword.controller';

const resetPasswordRouter = express.Router();

resetPasswordRouter.post("/reset-password", resetPasswordController);

export default resetPasswordRouter;