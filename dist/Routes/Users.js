"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// Sample in-memory database with 6 entries
const users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
    { id: 3, name: 'Charlie' },
    { id: 4, name: 'David' },
    { id: 5, name: 'Eve' },
    { id: 6, name: 'Frank' },
];
// Helper function to generate a new ID
const getNewId = () => Math.max(...users.map(u => u.id), 0) + 1;
// GET /users
router.get('/', (req, res) => {
    res.json(users);
});
router.get('/search', ((req, res) => {
    const name = req.query.name;
    if (name) {
        const filtered = users.filter(u => u.name.toLowerCase().includes(name.toLowerCase()));
        return res.json(filtered);
    }
    res.json(users);
}));
// GET /users/:id
router.get('/:id', (req, res, next) => {
    const user = users.find(u => u.id === +req.params.id);
    if (!user) {
        const err = new Error('User not found');
        err.status = 404;
        err.status = 404;
        return next(err);
    }
    res.json(user);
});
// GET /users/search?name=Reconfort
router.get('/search', (req, res) => {
    const name = req.query.name;
    const filtered = users.filter(u => u.name.toLowerCase().includes(name?.toLowerCase() || ''));
    res.json(filtered);
});
// POST /users
router.post('/', (req, res, next) => {
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        const err = new Error('User not found');
        err.status = 400;
        return next(err);
    }
    const newUser = {
        id: getNewId(),
        name: name.trim(),
    };
    users.push(newUser);
    res.status(201).json(newUser);
});
// PUT /users/:id
router.put('/:id', (req, res, next) => {
    const id = +req.params.id;
    if (isNaN(id)) {
        const err = new Error('User not found');
        err.status = 400;
        return next(err);
    }
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    const { name } = req.body;
    if (!name || typeof name !== 'string' || name.trim() === '') {
        const err = new Error('User not found');
        err.status = 400;
        return next(err);
    }
    users[userIndex].name = name.trim();
    res.json(users[userIndex]);
});
// DELETE /users/:id
router.delete('/:id', (req, res, next) => {
    const id = +req.params.id;
    if (isNaN(id)) {
        const err = new Error('User not found');
        err.status = 400;
        return next(err);
    }
    const userIndex = users.findIndex(u => u.id === id);
    if (userIndex === -1) {
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    }
    const deletedUser = users.splice(userIndex, 1)[0];
    res.json(deletedUser);
});
exports.default = router;
//# sourceMappingURL=Users.js.map