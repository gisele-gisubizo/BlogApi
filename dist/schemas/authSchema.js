"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.signupSchema = void 0;
const zod_1 = require("zod");
const common_schemas_1 = require("./common.schemas");
exports.signupSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: common_schemas_1.nameSchema,
        email: common_schemas_1.emailSchema,
        password: common_schemas_1.passwordSchema,
        role: zod_1.z.enum(["user", "admin"]).default("user"),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: common_schemas_1.emailSchema,
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: common_schemas_1.emailSchema,
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is required"),
    }),
    body: zod_1.z.object({
        newPassword: common_schemas_1.passwordSchema,
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    params: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is required"),
    }),
});
