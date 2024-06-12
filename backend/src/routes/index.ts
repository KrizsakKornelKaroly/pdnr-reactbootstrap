import { Router } from "express";
import loginRouter from "./login.router";
import registrationRouter from "./register.route";
import testRouter from "./test.router";
import logoutRouter from "./logout.route";

const router = Router();

router.use(loginRouter);
router.use(registrationRouter);
router.use(testRouter);
router.use(logoutRouter);
export default router;
