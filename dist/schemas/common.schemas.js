"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nameSchema = exports.passwordSchema = exports.emailSchema = exports.paginationSchema = exports.idParamSchema = void 0;
const zod_1 = require("zod");
exports.idParamSchema = zod_1.z.object({
    id: zod_1.z.string().regex(/^\d+$/, "ID must be a valid number").transform(Number),
});
exports.paginationSchema = zod_1.z.object({
    page: zod_1.z.string().regex(/^\d+$/).transform(Number).default("1"),
    limit: zod_1.z.string().regex(/^\d+$/).transform(Number).default("10"),
    sortBy: zod_1.z.string().optional(),
    sortOrder: zod_1.z.enum(["asc", "desc"]).default("asc"),
});
exports.emailSchema = zod_1.z
    .string()
    .email("Invalid email format")
    .max(100, "Email must be less than 100 characters");
exports.passwordSchema = zod_1.z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(255, "Password must be less than 255 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number");
exports.nameSchema = zod_1.z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name can only contain letters and spaces");
