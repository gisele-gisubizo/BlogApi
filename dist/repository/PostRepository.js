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
exports.PostRepository = void 0;
const database_1 = require("../config/database");
const Post_1 = require("../entities/Post");
exports.PostRepository = database_1.AppDataSource.getRepository(Post_1.Post).extend({
    createPost(postData) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = this.create(postData);
            return this.save(post);
        });
    },
    findAll(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findAndCount({
                take: limit,
                skip: (page - 1) * limit,
                relations: ["author"],
            });
        });
    },
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this.findOne({
                where: { id },
                relations: ["author"],
            });
            if (!post) {
                throw new Error("Post not found");
            }
            return post;
        });
    },
    updatePost(post) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.save(post);
        });
    },
    deletePost(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.delete(id);
        });
    },
});
