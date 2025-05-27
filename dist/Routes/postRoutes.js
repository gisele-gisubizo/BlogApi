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
const express_1 = require("express");
const PostService_1 = require("../services/PostService");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const postService = new PostService_1.PostService();
router.post("/", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, body } = req.body;
        const post = yield postService.createPost(title, body, req.user);
        res.status(201).json(post);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}));
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const result = yield postService.getPosts(page, limit);
        res.json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}));
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const post = yield postService.getPostById(parseInt(id));
        res.json(post);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}));
router.put("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, body } = req.body;
        const post = yield postService.updatePost(parseInt(id), title, body, req.user);
        res.json(post);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}));
router.delete("/:id", authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const result = yield postService.deletePost(parseInt(id), req.user);
        res.json(result);
    }
    catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
}));
exports.default = router;
