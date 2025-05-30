import express from "express";
import authRouter from "./Routes/authRoutes";
import userRouter from "./Routes/UserRoutes";
import postRouter from "./Routes/postRoutes";

import { InitializeDatabase } from "./config/database";
import { errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(express.json());

InitializeDatabase().then(() => {
  app.use("/", authRouter);
  app.use("/users", userRouter);
  app.use("/", postRouter);


  app.use(errorHandler);

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});