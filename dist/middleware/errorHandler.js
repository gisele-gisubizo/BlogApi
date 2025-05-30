"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.errorHandler = void 0;
const errors_1 = require("../utils/errors");
const errorHandler = (error, req, res, next) => {
    console.error("Error:", {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    if (error instanceof errors_1.ValidationError) {
        res.status(400).json({
            success: false,
            message: error.message,
            errors: error.errors,
        });
        return;
    }
    if (error instanceof errors_1.AppError) {
        res.status(error.statusCode).json({
            success: false,
            message: error.message,
        });
        return;
    }
    if (error.name === "QueryFailedError") {
        let message = "Database operation failed";
        let statusCode = 500;
        if (error.message.includes("UNIQUE constraint failed")) {
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
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
