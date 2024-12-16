import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",  // Correct since same VPS
  port: 3306,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
  // Optimized pool settings
  poolSize: 20,
  connectTimeout: 10000,
  extra: {
    connectionLimit: 20,
    maxIdle: 10,
    idleTimeout: 60000,
    waitForConnections: true,
    queueLimit: 0
  },
  // SSL disabled since same machine communication
  ssl: false
});

// Enhanced error handling and retry logic
const initializeDB = async (retries = 5) => {
  for (let i = 0; i < retries; i++) {
    try {
      await AppDataSource.initialize();
      console.log("Data Source initialized successfully");
      return;
    } catch (error) {
      console.error(`Failed to initialize DB (attempt ${i + 1}/${retries}):`, error);
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 5000)); // 5s delay between retries
    }
  }
};

initializeDB().catch(error => {
  console.error("Fatal: Could not initialize database:", error);
  process.exit(1);
});
