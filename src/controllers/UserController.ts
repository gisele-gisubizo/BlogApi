import { Request, Response } from "express";
import { UserService } from "../services/UserServices";
import { asyncHandler } from "../middleware/errorHandler";
import { NotFoundError } from "../utils/errors";

const userService = new UserService();

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userService.findAll();
  res.json({
    success: true,
    message: "Users retrieved successfully",
    data: { users },
  });
});

export const search = asyncHandler(async (req: Request, res: Response) => {
  const { name } = req.query as { name?: string };
  const users = name ? await userService.findByName(name) : [];
  res.json({
    success: true,
    message: "Search completed successfully",
    data: { users, count: users.length },
  });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.findById(id);
  res.json({
    success: true,
    message: "User retrieved successfully",
    data: { user },
  });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedUser = await userService.update(id, updateData);
  res.json({
    success: true,
    message: "User updated successfully",
    data: { user: updatedUser },
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const deleted = await userService.delete(id);
  if (!deleted) {
    throw new NotFoundError("User");
  }
  res.json({
    success: true,
    message: "User deleted successfully",
    data: {},
  });
});

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const result = await userService.getProfile(userId);
  res.json(result);
});

export const test = asyncHandler(async (req: Request, res: Response) => {
  console.log("GET /test hit");
  res.json({ success: true, message: "Test", data: {} });
});