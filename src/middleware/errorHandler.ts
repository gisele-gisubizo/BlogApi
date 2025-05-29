import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/errors";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
  });

  if (error instanceof ValidationError) {
    return res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export const asyncHandler =
  (fn: Function) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };