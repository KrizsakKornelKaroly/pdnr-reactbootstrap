require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs'
    }
  });
import express, { Request, Response } from "express";
import "reflect-metadata";
import session from "express-session";
import RedisStore from "connect-redis";
import { AppDataSource } from "./data-source";
import { UserInfo } from "./entity/UserInfo.entity";
import router from "./routes";
import "dotenv/config";
import cors from "cors";
import redisClient from "./utils/redisClient";
import { loadTimersFromRedis } from "./services/duty.service";
import helmet from "helmet";
import logger from "./logger";  // Import the logger

const PORT = parseInt(process.env.API_PORT || '3349');

console.log(AppDataSource)
AppDataSource.initialize().then(async () => {
    logger.info("Data Source has been initialized!");  // Log when the data source is initialized
    console.log("Is Data Source Initialized:", AppDataSource.isInitialized);

    await loadTimersFromRedis();
        
    const userRepo = AppDataSource.getRepository(UserInfo);
    const user = await userRepo.findOneBy({ user_id: 1 });
    logger.info(`User info loaded: ${user}`);  // Log user info retrieval
    
    const users = await AppDataSource.manager.find(UserInfo);
    logger.info(`Loaded users: ${JSON.stringify(users)}`);  // Log all users retrieved

    const app = express();

    // Logging middleware (using logger)
    app.use((req, res, next) => {
        logger.info(`Received ${req.method} request for ${req.originalUrl}`);  // Log request details
        next();
    });

    // Configure session middleware
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            secret: process.env.SESSION_SECRET || "defaultSecret",
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

    // CORS configuration
    app.use(
        cors({
            origin: [
                "http://localhost:5173",
                "http://88.151.101.171:3349",
                "http://88.151.101.171:5173",
                "http://0.0.0.0:3349",
                "http://0.0.0.0:5173",
            ],
            credentials: true,
            optionsSuccessStatus: 200,
            methods: ["GET", "POST", "OPTIONS"]
        })
    );

    // Apply Helmet for enhanced security (sets HTTP headers)
    app.use(helmet());

    // Apply routes
    app.use("/v1", router);

    // Error handling middleware
    app.use((err: any, req: Request, res: Response, next: any) => {
        logger.error('Unhandled error occurred', err);  // Log any unhandled errors
        res.status(500).send('Something broke!');
    });

    app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server is running on port ${PORT}`);  // Log server start
    });
})
.catch((error) => {
    logger.error("Error initializing data source", error);  // Log initialization error
});
