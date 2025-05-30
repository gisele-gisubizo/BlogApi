import { Router } from "express";
import { createPost, getPosts, getPostById, updatePost, deletePost } from "../controllers/postController";
import { authMiddleware } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/errorHandler";
import { validate } from "../middleware/validation";
import { createPostSchema, updatePostSchema } from "../schemas/post.schema";

const router = Router();

router.post("/create", authMiddleware, validate(createPostSchema), asyncHandler(createPost));
router.get("/get", authMiddleware, asyncHandler(getPosts));
router.get("/get/:id", asyncHandler(getPostById));
router.put("/update/:id", authMiddleware, validate(updatePostSchema), asyncHandler(updatePost));
router.delete("/delete/:id", authMiddleware, asyncHandler(deletePost));

// router.post("/posts", authMiddleware, asyncHandler(createPost));
// router.get("/posts", asyncHandler(getPosts));
// router.get("/:id", asyncHandler(getPostById));
// router.put("/:id", authMiddleware, asyncHandler(updatePost));
// router.delete("/:id", authMiddleware, asyncHandler(deletePost));

export default router;