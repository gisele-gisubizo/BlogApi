"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const authorize = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ success: false, message: "This user has insufficient permission" });
            return;
        }
        next();
    };
};
exports.authorize = authorize;
