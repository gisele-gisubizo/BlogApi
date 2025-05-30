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
Object.defineProperty(exports, "__esModule", { value: true });
exports.test = exports.getProfile = exports.deleteUser = exports.updateUser = exports.getById = exports.search = exports.getAllUsers = void 0;
const UserServices_1 = require("../services/UserServices");
const errorHandler_1 = require("../middleware/errorHandler");
const errors_1 = require("../utils/errors");
const userService = new UserServices_1.UserService();
exports.getAllUsers = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userService.findAll();
    res.json({
        success: true,
        message: "Users retrieved successfully",
        data: { users },
    });
}));
exports.search = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.query;
    const users = name ? yield userService.findByName(name) : [];
    res.json({
        success: true,
        message: "Search completed successfully",
        data: { users, count: users.length },
    });
}));
exports.getById = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield userService.findById(id);
    res.json({
        success: true,
        message: "User retrieved successfully",
        data: { user },
    });
}));
exports.updateUser = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const updateData = req.body;
    const updatedUser = yield userService.update(id, updateData);
    res.json({
        success: true,
        message: "User updated successfully",
        data: { user: updatedUser },
    });
}));
exports.deleteUser = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const deleted = yield userService.delete(id);
    if (!deleted) {
        throw new errors_1.NotFoundError("User");
    }
    res.json({
        success: true,
        message: "User deleted successfully",
        data: {},
    });
}));
exports.getProfile = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield userService.getProfile(userId);
    res.json(result);
}));
exports.test = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("GET /test hit");
    res.json({ success: true, message: "Test", data: {} });
}));
