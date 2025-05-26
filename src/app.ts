import "reflect-metadata";
import express from "express";
import { InitializeDatabase } from "../src/config/database";
import authRoutes from "./Routes/authRoutes";
import postRoutes from "./Routes/postRoutes";
import { errorHandler } from "./utils/errorHandler";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json());

// Routes
app.use("/", authRoutes); 
app.use("/posts", postRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

InitializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error("Failed to initialize database:", error);
});