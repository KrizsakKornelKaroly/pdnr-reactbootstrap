import express, { Request, Response } from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import { AppDataSource } from "./src/data-source";
import { UserInfo } from "./src/entity/UserInfo.entity";
import router from "./src/routes";
import "dotenv/config";
import cors from "cors";
import redisClient from "./src/utils/redis";
import { loadTimersFromRedis } from "./src/services/duty.service";

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    return loadTimersFromRedis();
  })
  
  .then(async () => {
    const userRepo = AppDataSource.getRepository(UserInfo);
    const user = await userRepo.findOneBy({ user_id: 1 });
    console.log(user);

    const app = express();
    const port = 3000;

    // Configure session middleware
    app.use(
      session({
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || "defaultSecret", // Ensure this is set in your .env
        resave: false,
        saveUninitialized: false,
        cookie: {
          secure: false, // Set to true if using HTTPS
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        },
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(
      cors({
        origin: "http://localhost:5173",
        credentials: true, // Ensure cookies are sent
        optionsSuccessStatus: 200,
      })
    );

    // Apply routes
    app.use("/v1", router);
    app.use((req, res, next) => {
      console.log(`Received ${req.method} request for ${req.originalUrl}`);
      next();
    });
    app.listen(port, () => console.log(`Server listening on port ${port}!`));
  })
  .catch((error) => console.error("Error initializing data source:", error));
