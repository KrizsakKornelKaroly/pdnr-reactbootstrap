import * as express from 'express';
import { loginController } from '../controllers/login.controller';


const loginRouter = express.Router();

loginRouter.post("/login", loginController);

export default loginRouter;