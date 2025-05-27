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
exports.UserRepository = void 0;
const database_1 = require("../config/database");
const User_1 = require("../entities/User");
exports.UserRepository = database_1.AppDataSource.getRepository(User_1.User).extend({
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = this.create(userData);
            return this.save(user);
        });
    },
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.findOneBy({ id });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        });
    },
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("user")
                .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` })
                .getMany();
        });
    },
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.findOneBy({ email });
        });
    },
    findByResetToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.createQueryBuilder("user")
                .where("user.resetPasswordToken = :token", { token })
                .andWhere("user.resetPasswordExpires > :now", { now: new Date() })
                .getOne();
        });
    },
});
