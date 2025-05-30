import { Router } from "express";
import { getAllUsers, search, getById, updateUser, deleteUser, getProfile, test } from "../controllers/userController";
import { authMiddleware } from "../middleware/authMiddleware";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validation";
import { getUserByIdSchema, updateUserSchema, deleteUserSchema, searchUsersSchema } from "../schemas/user.schema";

const router = Router();

router.get("/test", test);
router.get("/profile", authMiddleware, getProfile);
router.get("/search", validate(searchUsersSchema), search);
router.get("/getall", authMiddleware, authorize(["admin"]), getAllUsers);
router.get("/get/:id", authMiddleware, authorize(["admin"]), validate(getUserByIdSchema), getById);
router.put("/update/:id", authMiddleware, authorize(["admin"]), validate(updateUserSchema), updateUser);
router.delete("/delete/:id", authMiddleware, authorize(["admin"]), validate(deleteUserSchema), deleteUser);

export default router;