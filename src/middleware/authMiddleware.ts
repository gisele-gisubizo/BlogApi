import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserRepository } from "../repository/UserRepository";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Extract the token from the Authorization header, removing the "Bearer " prefix
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log("Authorization header:", req.header("Authorization")); // Log the header
  console.log("Extracted token:", token); // Log the token
  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
    console.log("Decoded token:", decoded); // Log the decoded payload
   
    const user = await UserRepository.findUserById(decoded.userId);
    console.log("Found user:", user); // Log the user
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    // Attach the user to the request object
    req.user = user;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.log("Token verification error:", error); // Log any verification errors
    res.status(401).json({ message: "Unauthorized" });
  }
};

// Extend Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}