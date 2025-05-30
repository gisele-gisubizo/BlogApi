import { Request, Response, NextFunction } from "express";
import { AppError, ValidationError } from "../utils/errors";
import { ApiResponse } from "../types/common.types";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): void => {
  console.error("Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (error instanceof ValidationError) {
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors,
    });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  if (error.name === "QueryFailedError") {
    let message = "Database operation failed";
    let statusCode = 500;

    if ((error as any).message.includes("UNIQUE constraint failed")) {
      message = "A record with this information already exists";
      statusCode = 409;
    }

    res.status(statusCode).json({
      success: false,
      message,
    });
    return;
  }

  if (error.name === "JsonWebTokenError") {
    res.status(401).json({
      success: false,
      message: "Invalid token",
    });
    return;
  }

  if (error.name === "TokenExpiredError") {
    res.status(401).json({
      success: false,
      message: "Token expired",
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === "production" ? "Internal server error" : error.message,
  });
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};