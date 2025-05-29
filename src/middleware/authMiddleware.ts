import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../Repositories/userRepository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Authorization header:", req.header("Authorization"));
  console.log("Extracted token:", token);
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token as string, process.env.JWT_SECRET!) as { userId: number };
    console.log("Decoded token:", decoded);
    const user = await UserRepository.findUserById(decoded.userId);
    console.log("Found user:", user);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log("Token verification error:", error);
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}