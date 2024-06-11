import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import { AppDataSource } from "./src/data-source";
import { UserInfo } from "./src/entity/UserInfo.entity";
import router from "./src/routes";
import "dotenv/config";

AppDataSource.initialize()
  .then(async () => {
    const userRepo = AppDataSource.getRepository(UserInfo);
    const user = await userRepo.findOneBy({ user_id: 1 });
    console.log(user);
    const app = express();
    const port = 3000;

    const redisClient = new Redis({
      host: "localhost",
      port: 6379,
    });

    redisClient.on("error", (err) => {
      console.error("Redis Client Error", err);
    });

    //const RedisStore = connectRedis(session);
    
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        cookie: { secure: false }, // Set to true if using HTTPS
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/v1", router);

    app.listen(port, () => console.log(`Server listening on port ${port}!`));
  })
  .catch((error) => console.log(error));
