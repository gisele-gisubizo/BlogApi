"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authRoutes_1 = __importDefault(require("./Routes/authRoutes"));
const UserRoutes_1 = __importDefault(require("./Routes/UserRoutes"));
const postRoutes_1 = __importDefault(require("./Routes/postRoutes"));
const database_1 = require("./config/database");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use(express_1.default.json());
(0, database_1.InitializeDatabase)().then(() => {
    app.use("/", authRoutes_1.default);
    app.use("/api/users", UserRoutes_1.default);
    app.use("/api/posts", postRoutes_1.default);
    app.use(errorHandler_1.errorHandler);
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});
