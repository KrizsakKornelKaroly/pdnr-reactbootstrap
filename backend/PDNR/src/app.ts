require('ts-node').register({
    transpileOnly: true,
    compilerOptions: {
      module: 'commonjs'
    }
  });
import express, { Request, Response, NextFunction } from "express";
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
import rateLimit from 'express-rate-limit';
import hpp from 'hpp';
import compression from 'compression';
import logger from "./logger";  // Import the logger

// Security: Move to environment variables
const PORT = parseInt(process.env.API_PORT || '3349');
const NODE_ENV = process.env.NODE_ENV || 'development';

console.log(AppDataSource)
AppDataSource.initialize().then(async () => {
    logger.info("Data Source has been initialized!");  // Log when the data source is initialized
    console.log("Is Data Source Initialized:", AppDataSource.isInitialized);

    const app = express();

    // Security Headers
    app.use(helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"],
                fontSrc: ["'self'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                frameSrc: ["'none'"],
            },
        },
        crossOriginEmbedderPolicy: true,
        crossOriginOpenerPolicy: true,
        crossOriginResourcePolicy: { policy: "same-site" },
        dnsPrefetchControl: { allow: false },
        frameguard: { action: "deny" },
        hidePoweredBy: true,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        },
        ieNoOpen: true,
        noSniff: true,
        referrerPolicy: { policy: "strict-origin-when-cross-origin" },
        xssFilter: true,
    }));

    // Rate limiting
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests from this IP, please try again later.',
        standardHeaders: true,
        legacyHeaders: false,
    });

    // Apply rate limiting to all routes except auth checks
    app.use((req, res, next) => {
        const authPaths = ['/check-auth', '/v1/check-auth'];
        if (authPaths.some(path => req.originalUrl.startsWith(path))) {
            return next();
        }
        limiter(req, res, next);
    });

    // Prevent HTTP Parameter Pollution
    app.use(hpp());

    // Compression
    app.use(compression());

    // Logging middleware
    app.use((req: Request, res: Response, next: NextFunction) => {
        logger.info(`${req.method} ${req.originalUrl} - IP: ${req.ip}`);
        res.on('finish', () => {
            logger.info(`${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
        });
        next();
    });

    // Updated CORS configuration
    app.use(cors({
        origin: [
            'https://betademov3.arrp-lspd.hu',
            'http://localhost:5173'
        ],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Cookie'],
        exposedHeaders: ['Content-Length', 'Set-Cookie', 'Authorization', 'X-CSRF-Token']
    }));

    // Session configuration
    const sessionConfig = {
        store: new RedisStore({ client: redisClient }),
        secret: process.env.SESSION_SECRET || "defaultSecret",
        name: 'sessionId',
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: NODE_ENV === 'production',
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
            sameSite: NODE_ENV === 'production' ? 'none' : 'lax' as 'lax' | 'none',
            domain: '', // Explicitly set fallback domain '.arrp-lspd.hu'
            path: '/',
        },
        rolling: true,
    };
    app.use(session(sessionConfig));

    // Body parsers with limits
    app.use(express.json({ limit: '10kb' }));
    app.use(express.urlencoded({ extended: true, limit: '10kb' }));

    // Security: Add timeout to all requests
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.setTimeout(30000, () => {
            res.status(408).send('Request Timeout');
        });
        next();
    });

    await loadTimersFromRedis();
        
    //const userRepo = AppDataSource.getRepository(UserInfo);
    //const user = await userRepo.findOneBy({ user_id: 1 });
    //logger.info(`User info loaded: ${user}`);  // Log user info retrieval
    
   // const users = await AppDataSource.manager.find(UserInfo);
   // logger.info(`Loaded users: ${JSON.stringify(users)}`);  // Log all users retrieved

    // Routes
    app.use("/v1", router);

    // 404 handler
    app.use((req: Request, res: Response) => {
        res.status(404).json({ error: 'Not Found' });
    });

    // Error handling middleware
    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        logger.error('Error:', {
            message: err.message,
            stack: err.stack,
            path: req.path,
            method: req.method,
        });

        // Don't expose internal error details in production
        const response = NODE_ENV === 'production' 
            ? { error: 'Internal Server Error' }
            : { error: err.message, stack: err.stack };

        res.status(500).json(response);
    });

    // Graceful shutdown
    const gracefulShutdown = async () => {
        logger.info('Received shutdown signal. Starting graceful shutdown...');
        
        // Close server
        server.close(async () => {
            logger.info('HTTP server closed.');
            
            try {
                // Close database connection
                await AppDataSource.destroy();
                logger.info('Database connection closed.');
                
                // Close Redis connection
                await redisClient.quit();
                logger.info('Redis connection closed.');
                
                process.exit(0);
            } catch (error) {
                logger.error('Error during shutdown:', error);
                process.exit(1);
            }
        });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);

    const server = app.listen(PORT, '0.0.0.0', () => {
        logger.info(`Server is running on port ${PORT} in ${NODE_ENV} mode`);
    });
})
.catch((error) => {
    logger.error("Error initializing data source:", error);
    process.exit(1);
});