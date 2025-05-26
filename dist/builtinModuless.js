"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const greetings_1 = __importDefault(require("./greetings"));
console.log('current file:', path_1.default.basename(__filename));
console.log('Directory:', path_1.default.basename(__dirname));
console.log((0, greetings_1.default)('klab'));
//# sourceMappingURL=builtinModuless.js.map