import { Request, Response } from "express";
import { PostService } from "../services/PostService";
import { asyncHandler } from "../middleware/errorHandler";

const postService = new PostService();

export const createPost = asyncHandler(async (req: Request, res: Response) => {
  const { title, body } = req.body;
  const post = await postService.createPost(title, body, req.user!);
  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: { post },
  });
});

export const getPosts = asyncHandler(async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const result = await postService.getPosts(page, limit);
  res.json({
    success: true,
    message: "Posts retrieved successfully",
    data: result,
  });
});

export const getPostById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const post = await postService.getPostById(parseInt(id));
  res.json({
    success: true,
    message: "Post retrieved successfully",
    data: { post },
  });
});

export const updatePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, body } = req.body;
  const post = await postService.updatePost(parseInt(id), title, body, req.user!);
  res.json({
    success: true,
    message: "Post updated successfully",
    data: { post },
  });
});

export const deletePost = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await postService.deletePost(parseInt(id), req.user!);
  res.json({
    success: true,
    message: "Post deleted successfully",
    data: {},
  });
});