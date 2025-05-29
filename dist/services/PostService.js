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
exports.PostService = void 0;
const PostRepository_1 = require("../repository/PostRepository");
class PostService {
    createPost(title, body, author) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!title || !body) {
                throw { status: 400, message: "Title and body are required" };
            }
            const post = yield PostRepository_1.PostRepository.createPost({ title, body, author });
            return post;
        });
    }
    getPosts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [posts, total] = yield PostRepository_1.PostRepository.findAll(page, limit);
            return { posts, total, page, totalPages: Math.ceil(total / limit) };
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield PostRepository_1.PostRepository.findById(id);
                return post;
            }
            catch (error) {
                throw { status: 404, message: error.message || "Post not found" };
            }
        });
    }
    updatePost(id, title, body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield PostRepository_1.PostRepository.findById(id);
                if (post.author.id !== user.id) {
                    throw { status: 403, message: "Not authorized to update this post" };
                }
                post.title = title || post.title;
                post.body = body || post.body;
                return yield PostRepository_1.PostRepository.updatePost(post);
            }
            catch (error) {
                throw { status: error.status || 404, message: error.message || "Post not found" };
            }
        });
    }
    deletePost(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield PostRepository_1.PostRepository.findById(id);
                if (post.author.id !== user.id) {
                    throw { status: 403, message: "Not authorized to delete this post" };
                }
                yield PostRepository_1.PostRepository.deletePost(id);
                return { message: "Post deleted successfully" };
            }
            catch (error) {
                throw { status: error.status || 404, message: error.message || "Post not found" };
            }
        });
    }
}
exports.PostService = PostService;
