import express from "express";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";
import { AppDataSource } from "./src/data-source";
import { UserInfo } from "./src/entity/UserInfo.entity";
import registrationRouter from "./src/routes/register.route";
import loginRouter from "./src/routes/login.router";


AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 3000;
    app.use(express.json());

    app.use(
      session({
        secret: process.env.SESSION_SECRET,
        resave: false, // Don't save session if unmodified
        saveUninitialized: false, // Don't create session until something stored
      })
    );

    // Now you can use req.session to store or access session data
    app.get("/", (req, res) => {
      // Increment a counter in the session
      if (req.session) {
        console.log(req.session)
      } else {
        console.log('error')
      }

      res.send(`You have visited this page ${req.session} times`);
    });

    const userRepo = AppDataSource.getRepository(UserInfo);
    const user = await userRepo.findOneBy({ user_id: 1 });
    console.log(user);

    app.use(registrationRouter);
    app.use(loginRouter);

    app.listen(port, () => console.log(`Server listening on port ${port}!`));
  })
  .catch((error) => console.log(error));
