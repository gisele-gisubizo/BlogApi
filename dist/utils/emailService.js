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
exports.EmailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
function createTransporter() {
    return __awaiter(this, void 0, void 0, function* () {
        return nodemailer_1.default.createTransport({
            service: "Gmail",
            host: process.env.EMAIL_HOST,
            port: parseInt(process.env.EMAIL_PORT || "465"),
            secure: process.env.EMAIL_SECURE === "true",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    });
}
class EmailService {
    sendVerificationEmail(email, link) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield createTransporter();
            yield transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Verify Your Email",
                html: `
        <h2>Welcome!</h2>
        <p>Click below to verify your email:</p>
        <a href="${link}">${link}</a>
        <p>This link expires in 24 hours.</p>
      `,
            });
        });
    }
    sendResetPasswordEmail(email, resetLink) {
        return __awaiter(this, void 0, void 0, function* () {
            const transporter = yield createTransporter();
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Reset Your Password",
                html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>This link will expire in 15 minutes.</p>
      `,
            };
            try {
                yield transporter.sendMail(mailOptions);
            }
            catch (error) {
                console.error("Failed to send email:", error);
                throw new Error("Failed to send reset password email. Please try again later.");
            }
        });
    }
}
exports.EmailService = EmailService;
