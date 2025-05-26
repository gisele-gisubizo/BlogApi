"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const index_js_1 = __importDefault(require("./Routes/index.js"));
const Users_js_1 = __importDefault(require("./Routes/Users.js"));
const app = (0, express_1.default)();
const PORT = 3000;
// Middleware: parse json bodies
app.use(express_1.default.json());
// routers
app.use('/', index_js_1.default);
app.use('/users', Users_js_1.default);
app.listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}`);
});
//# sourceMappingURL=app.js.map