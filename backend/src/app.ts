import express, { Request, Response } from "express";
import session from "express-session";
import RedisStore from "connect-redis";
import { AppDataSource } from "./data-source";
import { UserInfo } from "./entity/UserInfo.entity";
import router from "./routes";
import "dotenv/config";
import cors from "cors";
import redisClient from "./utils/redisClient";
import { loadTimersFromRedis } from "./services/duty.service";

const PORT = parseInt(process.env.API_PORT || '3349');

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

        // Logging middleware should be first
        app.use((req, res, next) => {
            console.log(`Received ${req.method} request for ${req.originalUrl}`);
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

        // Updated CORS configuration to allow VPS IP
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

        // Apply routes
        app.use("/v1", router);

        // Error handling middleware
        app.use((err: any, req: Request, res: Response, next: any) => {
            console.error(err.stack);
            res.status(500).send('Something broke!');
        });

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port 3306`);
        });
    })
    .catch((error) => console.error("Error initializing data source:", error));