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
exports.deletePost = exports.updatePost = exports.getPostById = exports.getPosts = exports.createPost = void 0;
const PostService_1 = require("../services/PostService");
const errorHandler_1 = require("../middleware/errorHandler");
const postService = new PostService_1.PostService();
exports.createPost = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, body } = req.body;
    const post = yield postService.createPost(title, body, req.user);
    res.status(201).json({
        success: true,
        message: "Post created successfully",
        data: { post },
    });
}));
exports.getPosts = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const result = yield postService.getPosts(page, limit);
    res.json({
        success: true,
        message: "Posts retrieved successfully",
        data: result,
    });
}));
exports.getPostById = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield postService.getPostById(parseInt(id));
    res.json({
        success: true,
        message: "Post retrieved successfully",
        data: { post },
    });
}));
exports.updatePost = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, body } = req.body;
    const post = yield postService.updatePost(parseInt(id), title, body, req.user);
    res.json({
        success: true,
        message: "Post updated successfully",
        data: { post },
    });
}));
exports.deletePost = (0, errorHandler_1.asyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield postService.deletePost(parseInt(id), req.user);
    res.json({
        success: true,
        message: "Post deleted successfully",
        data: {},
    });
}));
