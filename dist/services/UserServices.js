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
exports.UserService = void 0;
const UserRepository_1 = require("../repository/UserRepository");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const emailService_1 = require("../utils/emailService");
class UserService {
    constructor() {
        this.emailService = new emailService_1.EmailService();
    }
    register(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!name || !email || !password) {
                throw { status: 400, message: "All fields are required" };
            }
            const existingUser = yield UserRepository_1.UserRepository.findByEmail(email);
            if (existingUser) {
                throw { status: 400, message: "Email already exists" };
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const userData = { name, email, password: hashedPassword };
            const user = yield UserRepository_1.UserRepository.createUser(userData);
            return { message: "User registered successfully" };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !password) {
                throw { status: 400, message: "All fields are required" };
            }
            const user = yield UserRepository_1.UserRepository.findByEmail(email);
            if (!user) {
                throw { status: 401, message: "Invalid credentials" };
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw { status: 401, message: "Invalid credentials" };
            }
            if (!process.env.JWT_SECRET) {
                throw { status: 500, message: "JWT secret not configured" };
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return { token };
        });
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserRepository_1.UserRepository.findUserById(userId);
                return { id: user.id, name: user.name, email: user.email };
            }
            catch (error) {
                throw { status: 404, message: error.message || "User not found" };
            }
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw { status: 400, message: "Email is required" };
            }
            const user = yield UserRepository_1.UserRepository.findByEmail(email);
            if (!user) {
                throw { status: 404, message: "User not found" };
            }
            if (!process.env.JWT_SECRET) {
                throw { status: 500, message: "JWT secret not configured" };
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            user.resetPasswordToken = token;
            user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
            yield UserRepository_1.UserRepository.save(user);
            yield this.emailService.sendResetPasswordEmail(user.email, token);
            return { message: "Password reset email sent" };
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token || !newPassword) {
                throw { status: 400, message: "Token and new password are required" };
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = yield UserRepository_1.UserRepository.findByResetToken(token); // Use custom method
                if (!user) {
                    throw { status: 400, message: "Invalid or expired token" };
                }
                user.password = yield bcrypt_1.default.hash(newPassword, 10);
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                yield UserRepository_1.UserRepository.save(user);
                return { message: "Password reset successfully" };
            }
            catch (error) {
                throw { status: 400, message: "Invalid or expired token" };
            }
        });
    }
}
exports.UserService = UserService;
