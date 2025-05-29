import { Router , Request, Response } from "express";
import { PostService } from "../services/PostService";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const postService = new PostService();

router.post("/", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { title, body } = req.body;
    const post = await postService.createPost(title, body, req.user!);
    res.status(201).json(post);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.get("/", async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const result = await postService.getPosts(page, limit);
    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const post = await postService.getPostById(parseInt(id));
    res.json(post);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, body } = req.body;
    const post = await postService.updatePost(parseInt(id), title, body, req.user!);
    res.json(post);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await postService.deletePost(parseInt(id), req.user!);
    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

export default router;