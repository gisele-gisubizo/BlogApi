"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('<h2>Welcome to the Home Page</h2>');
});
router.get('/status', (req, res) => {
    res.json({ status: 'OK', uptime: process.uptime() });
});
exports.default = router;
