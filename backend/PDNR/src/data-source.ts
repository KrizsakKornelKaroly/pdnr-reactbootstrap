import "reflect-metadata"
import { DataSource } from "typeorm"
import dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",  // Correct since same VPS
    port: 3306,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging:  ['error'],
    entities: [__dirname + "/../**/*.entity.{js,ts}"],
    // Optimized pool settings
    poolSize: 20,
    connectTimeout: 10000,
    cache: {
      duration: 60000 // 1 minute cache
    },
    extra: {
      connectionLimit: 20,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
      maxIdle: 10,
      idleTimeout: 60000,
      waitForConnections: true,
    },
    // SSL disabled since same machine communication
    ssl: false,
    migrations: ["src/migration/**/**{.ts,.js}"],
    subscribers: [],
})