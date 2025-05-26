import { DataSource } from "typeorm";
import { User } from "../entities/User";
import { Post } from "../entities/Post";
import * as dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432"),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "12345",
  database: process.env.DATABASE_NAME || "Users",
  entities: [User, Post],
  synchronize: true, // Not advisable for production
  logging: true,
});

export const InitializeDatabase = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Error connecting to the database", error);
    process.exit(1); // Exit on failure to ensure server doesn't start without DB
  }
};