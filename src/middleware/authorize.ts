import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: any;
}

export const authorize = (allowedRoles: ("user" | "admin")[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    console.log("req.user:", req.user);
    if (!req.user) {
      res.status(401).json({ success: false, message: "Not authenticated" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({ success: false, message: "This user has insufficient permission" });
      return;
    }

    next();
  };
};