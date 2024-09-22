import * as express from 'express';
import { checkAuth } from '../middleware/auth.middleware';
import { stopDutyController } from '../controllers/stopDuty.controller';


const stopDutyRoute = express.Router();

stopDutyRoute.post("/stopDuty", checkAuth, stopDutyController);

export default stopDutyRoute;