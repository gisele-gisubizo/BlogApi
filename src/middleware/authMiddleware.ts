import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { AppDataSource } from "../config/database";

interface JwtPayload {
  id: number;
  email: string;
  name: string;
  role: "user" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res.status(401).json({ success: false, message: "You are not authorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await AppDataSource.getRepository(User).findOneBy({ id: decoded.id });
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(403).json({ success: false, message: "Token is expired or invalid" });
  }
};