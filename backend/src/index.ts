import express from "express";
import { AppDataSource } from "./data-source";
import { UserInfo } from "./entity/UserInfo.entity";
import registrationRouter from "./routes/register.route";
import { createClient } from "redis";
import session from "express-session";
import connectRedis from "connect-redis";

AppDataSource.initialize()
  .then(async () => {
    const app = express();
    const port = 3000;
    app.use(express.json());

    // Initialize client.
    let redisClient = createClient();
    redisClient.connect().catch(console.error);

    // Initialize store.
    const redisStore = connectRedis(session);

    // Initialize session storage.
    app.use(
      session({
        store: new redisStore({
          client: redisClient,
          prefix: "myapp:",
        }),
        resave: false, // required: force lightweight session keep alive (touch)
        saveUninitialized: false, // recommended: only save session when data exists
        secret: "keyboard cat",
      })
    );

    const userRepo = AppDataSource.getRepository(UserInfo);
    const user = await userRepo.findOneBy({ user_id: 1 });
    console.log(user);

    app.use(registrationRouter);

    app.listen(port, () => console.log(`Server listening on port ${port}!`));
  })
  .catch((error) => console.log(error));
