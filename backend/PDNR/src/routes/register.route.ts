import * as express from 'express';
import { registrationController } from "../controllers/registration.controller";

const registrationRouter = express.Router();

registrationRouter.post("/register", registrationController);

export default registrationRouter;