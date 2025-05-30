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
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const EmailService_1 = require("../utils/EmailService");
const errors_1 = require("../utils/errors");
class UserService {
    constructor() {
        this.userRepository = database_1.AppDataSource.getRepository(User_1.User);
        this.emailService = new EmailService_1.EmailService();
    }
    register(name_1, email_1, password_1) {
        return __awaiter(this, arguments, void 0, function* (name, email, password, role = "user") {
            if (!name || !email || !password) {
                throw new errors_1.ValidationError("All fields are required", {});
            }
            const existingUser = yield this.userRepository.findOneBy({ email });
            if (existingUser) {
                throw new errors_1.ConflictError("User with this email already exists");
            }
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const userData = { name, email, password: hashedPassword, role, isVerified: false, isActive: true };
            const user = yield this.userRepository.save(this.userRepository.create(userData));
            const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
            const verifyLink = `http://localhost:3000/verify-email/${token}`; // Updated to use backend URL with path parameter
            yield this.emailService.sendVerificationEmail(user.email, verifyLink);
            return {
                success: true,
                message: "User registered successfully. Please check your email to verify your account.",
                data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
            };
        });
    }
    verifyEmail(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token) {
                throw new errors_1.ValidationError("Token is required", {});
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = yield this.userRepository.findOneBy({ id: decoded.userId });
                if (!user) {
                    throw new errors_1.NotFoundError("User");
                }
                if (user.isVerified) {
                    throw new errors_1.ConflictError("Email is already verified");
                }
                user.isVerified = true;
                yield this.userRepository.save(user);
                return { success: true, message: "Email verified successfully" };
            }
            catch (error) {
                throw new errors_1.ValidationError("Invalid or expired token", {});
            }
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email || !password) {
                throw new errors_1.ValidationError("All fields are required", {});
            }
            const user = yield this.userRepository.findOneBy({ email });
            if (!user) {
                throw new errors_1.UnauthorizedError("Invalid credentials");
            }
            if (!user.isVerified) {
                throw new errors_1.ForbiddenError("Please verify your email before logging in");
            }
            if (!user.isActive) {
                throw new errors_1.ForbiddenError("Your account has been deactivated");
            }
            const isMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isMatch) {
                throw new errors_1.UnauthorizedError("Invalid credentials");
            }
            const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
            return {
                success: true,
                message: "Login successful",
                data: {
                    user: { id: user.id, name: user.name, email: user.email, role: user.role },
                    token,
                },
            };
        });
    }
    getProfile(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id: userId });
            if (!user) {
                throw new errors_1.NotFoundError("User");
            }
            return {
                success: true,
                message: "User retrieved successfully",
                data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
            };
        });
    }
    forgotPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!email) {
                throw new errors_1.ValidationError("Email is required", {});
            }
            const user = yield this.userRepository.findOneBy({ email });
            if (!user) {
                throw new errors_1.NotFoundError("No user found with that email address");
            }
            const token = jsonwebtoken_1.default.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "15m" });
            user.resetPasswordToken = token;
            user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
            yield this.userRepository.save(user);
            const resetLink = `${process.env.RESET_PASSWORD_URL}/reset-password?token=${token}`;
            yield this.emailService.sendResetPasswordEmail(user.email, resetLink);
            return { success: true, message: "Password reset link sent to your email" };
        });
    }
    resetPassword(token, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!token || !newPassword) {
                throw new errors_1.ValidationError("Token and new password are required", {});
            }
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
                const user = yield this.userRepository.findOneBy({ email: decoded.email });
                if (!user || user.resetPasswordToken !== token || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
                    throw new errors_1.ValidationError("Invalid or expired token", {});
                }
                user.password = yield bcrypt_1.default.hash(newPassword, 10);
                user.resetPasswordToken = null;
                user.resetPasswordExpires = null;
                yield this.userRepository.save(user);
                return { success: true, message: "Password reset successfully" };
            }
            catch (error) {
                throw new errors_1.ValidationError("Invalid or expired token", {});
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.find();
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id: parseInt(id) });
            if (!user) {
                throw new errors_1.NotFoundError("User");
            }
            return user;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository
                .createQueryBuilder("user")
                .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` })
                .getMany();
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userRepository.findOneBy({ email });
        });
    }
    update(id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOneBy({ id: parseInt(id) });
            if (!user) {
                throw new errors_1.NotFoundError("User");
            }
            if (updatedData.email && updatedData.email !== user.email) {
                const userWithEmail = yield this.userRepository.findOneBy({ email: updatedData.email });
                if (userWithEmail) {
                    throw new errors_1.ConflictError("Email is already in use");
                }
            }
            if (updatedData.password) {
                updatedData.password = yield bcrypt_1.default.hash(updatedData.password, 10);
            }
            Object.assign(user, updatedData);
            return yield this.userRepository.save(user);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.userRepository.delete(parseInt(id));
            return result.affected ? result.affected > 0 : false;
        });
    }
}
exports.UserService = UserService;
