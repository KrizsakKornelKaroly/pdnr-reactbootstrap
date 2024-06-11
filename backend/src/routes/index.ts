import { Router } from "express";
import loginRouter from "./login.router";
import registrationRouter from "./register.route";

const router = Router();

router.use(loginRouter);
router.use(registrationRouter);

export default router;
