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
const database_1 = require("../config/database");
const Post_1 = require("../entities/Post");
const errors_1 = require("../utils/errors");
class PostService {
    constructor() {
        this.postRepository = database_1.AppDataSource.getRepository(Post_1.Post);
    }
    createPost(title, body, author) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!title || !body) {
                throw new errors_1.ValidationError("Title and body are required", {});
            }
            const post = yield this.postRepository.save(this.postRepository.create({ title, body, author }));
            return post;
        });
    }
    getPosts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const [posts, total] = yield this.postRepository.findAndCount({
                take: limit,
                skip: (page - 1) * limit,
                relations: ["author"],
            });
            return { posts, total, page, totalPages: Math.ceil(total / limit) };
        });
    }
    getPostById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findOne({
                where: { id },
                relations: ["author"],
            });
            if (!post) {
                throw new errors_1.NotFoundError("Post");
            }
            return post;
        });
    }
    updatePost(id, title, body, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findOne({
                where: { id },
                relations: ["author"],
            });
            if (!post) {
                throw new errors_1.NotFoundError("Post");
            }
            if (post.author.id !== user.id) {
                throw new errors_1.ForbiddenError("Not authorized to update this post");
            }
            post.title = title || post.title;
            post.body = body || post.body;
            return yield this.postRepository.save(post);
        });
    }
    deletePost(id, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.postRepository.findOne({
                where: { id },
                relations: ["author"],
            });
            if (!post) {
                throw new errors_1.NotFoundError("Post");
            }
            if (post.author.id !== user.id) {
                throw new errors_1.ForbiddenError("Not authorized to delete this post");
            }
            yield this.postRepository.delete(id);
            return { message: "Post deleted successfully" };
        });
    }
}
exports.PostService = PostService;
