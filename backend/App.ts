import express from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import Redis from 'ioredis';
import { AppDataSource } from "./src/data-source";
import { UserInfo } from "./src/entity/UserInfo.entity";
import router from "./src/routes";
import "dotenv/config";
import cors from 'cors';

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
        cookie: { 
          secure: false,
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24, // 1 day
        }
        
      })
    );

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true, // Ensure cookies are sent
      optionsSuccessStatus: 200
    }));
    
    
    // Apply routes
    app.use("/v1", router);
    app.use((req, res, next) => {
      console.log(`Received ${req.method} request for ${req.originalUrl}`);
      next();
    });
    

    app.listen(port, () => console.log(`Server listening on port ${port}!`));
  })
  .catch((error) => console.log(error));
