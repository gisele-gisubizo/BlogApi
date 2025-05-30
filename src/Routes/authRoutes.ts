import { Router, Request, Response } from "express";
import { signup, verifyEmail, login, forgotPassword, resetPassword } from "../controllers/authControllers";
import { validate } from "../middleware/validation";
import { signupSchema, loginSchema, forgotPasswordSchema, resetPasswordSchema, verifyEmailSchema } from "../schemas/authSchema";

const router = Router();

router.post("/signup", validate(signupSchema), signup);
router.get("/verify-email/:token", validate(verifyEmailSchema), verifyEmail);
router.post("/login", validate(loginSchema), login);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

export default router;