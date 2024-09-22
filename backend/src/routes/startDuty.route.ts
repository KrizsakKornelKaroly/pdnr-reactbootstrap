import * as express from 'express';
import { startDutyController } from '../controllers/startDuty.controller';
import { checkAuth } from '../middleware/auth.middleware';


const startDutyRoute = express.Router();

startDutyRoute.post("/startDuty", checkAuth, startDutyController);

export default startDutyRoute;