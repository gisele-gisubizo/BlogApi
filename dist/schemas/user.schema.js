"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserSchema = exports.searchUsersSchema = exports.getUserByIdSchema = exports.updateUserSchema = exports.createUserSchema = void 0;
const zod_1 = require("zod");
const common_schemas_1 = require("./common.schemas");
exports.createUserSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: common_schemas_1.nameSchema,
        email: common_schemas_1.emailSchema,
        password: common_schemas_1.passwordSchema,
        role: zod_1.z.enum(["user", "admin"]).default("user"),
    }),
});
exports.updateUserSchema = zod_1.z.object({
    params: common_schemas_1.idParamSchema,
    body: zod_1.z
        .object({
        name: common_schemas_1.nameSchema.optional(),
        email: common_schemas_1.emailSchema.optional(),
        role: zod_1.z.enum(["user", "admin"]).optional(),
        isActive: zod_1.z.boolean().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one field must be provided for update",
    }),
});
exports.getUserByIdSchema = zod_1.z.object({
    params: common_schemas_1.idParamSchema,
});
exports.searchUsersSchema = zod_1.z.object({
    query: zod_1.z
        .object({
        name: zod_1.z.string().min(1, "Search term is required").optional(),
        email: zod_1.z.string().email().optional(),
        role: zod_1.z.enum(["user", "admin"]).optional(),
        isActive: zod_1.z.boolean().optional(),
        isVerified: zod_1.z.boolean().optional(),
    })
        .refine((data) => Object.keys(data).length > 0, {
        message: "At least one search parameter is required",
    }),
});
exports.deleteUserSchema = zod_1.z.object({
    params: common_schemas_1.idParamSchema,
});
