"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResetToken = void 0;
exports.generateJWT = generateJWT;
exports.generateVerifyToken = generateVerifyToken;
exports.verifyVerifyToken = verifyVerifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
function generateJWT(user) {
    return jsonwebtoken_1.default.sign({
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
    }, JWT_SECRET, { expiresIn: '1h' });
}
const generateResetToken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, JWT_SECRET, { expiresIn: '15m' });
};
exports.generateResetToken = generateResetToken;
function generateVerifyToken(payload) {
    if (!process.env.JWT_SECRET) {
        throw new Error('Missing JWT_SECRET in environment');
    }
    return jsonwebtoken_1.default.sign({ userId: payload.userId, email: payload.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
}
function verifyVerifyToken(token) {
    if (!process.env.JWT_SECRET) {
        throw new Error('Missing JWT_SECRET in environment');
    }
    return jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
}
