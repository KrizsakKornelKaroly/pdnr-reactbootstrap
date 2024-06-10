import "reflect-metadata";
import { DataSource } from "typeorm";
import "dotenv/config";
import { UserInfo } from "./entity/UserInfo.entity";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.HOST,
  port: 3306,
  username: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB,
  synchronize: true,
  entities: [__dirname + "/../**/*.entity.{js,ts}"],
});
