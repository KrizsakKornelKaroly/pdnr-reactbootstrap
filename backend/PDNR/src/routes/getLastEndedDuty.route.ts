import express from 'express';
import { getLastEndedDuty } from '../controllers/getLastEndedDuty.controller';
import { checkAuth } from '../middleware/auth.middleware';


const loginRouter = express.Router();

loginRouter.post("/getLastEndedDuty", checkAuth, getLastEndedDuty);

export default loginRouter;