import { Request, Response } from "express";
import { UserService } from "../services/UserServices";
import { asyncHandler } from "../middleware/errorHandler";

const userService = new UserService();

export const signup = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const result = await userService.register(name, email, password, role);
  res.status(201).json(result);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const result = await userService.verifyEmail(token);
  res.json(result);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const result = await userService.login(email, password);
  res.json(result);
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;
  const result = await userService.forgotPassword(email);
  res.json(result);
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  const result = await userService.resetPassword(token, newPassword);
  res.json(result);
});