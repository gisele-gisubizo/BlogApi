"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const UserRepository_1 = require("../repository/UserRepository");
const authMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Extract the token from the Authorization header, removing the "Bearer " prefix
    const token = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    console.log("Authorization header:", req.header("Authorization")); // Log the header
    console.log("Extracted token:", token); // Log the token
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded); // Log the decoded payload
        const user = yield UserRepository_1.UserRepository.findUserById(decoded.userId);
        console.log("Found user:", user); // Log the user
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        // Attach the user to the request object
        req.user = user;
        // Proceed to the next middleware or route handler
        next();
    }
    catch (error) {
        console.log("Token verification error:", error); // Log any verification errors
        res.status(401).json({ message: "Unauthorized" });
    }
});
exports.authMiddleware = authMiddleware;
