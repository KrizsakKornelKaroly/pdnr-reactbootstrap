import * as express from 'express';
import { resetPasswordController } from '../controllers/resetPassword.controller';

const resetPasswordRoute = express.Router();

resetPasswordRoute.post("/reset-password", resetPasswordController);

export default resetPasswordRoute;