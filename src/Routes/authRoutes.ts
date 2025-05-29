import { Router, Request, Response } from "express";
import { UserService } from "../services/UserServices";
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router();
const userService = new UserService();

router.get("/test", (req: Request, res: Response) => {
  console.log("GET /test hit");
  res.json({ message: "Test" });
});

router.post("/register", async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    const result = await userService.register(name, email, password);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await userService.login(email, password);
    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.get("/profile", authMiddleware, async (req: Request, res: Response) => {
  try {
    const result = await userService.getProfile(req.user!.id);
    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.post("/forgot", async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const result = await userService.forgotPassword(email);
    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }
});

router.post("/reset", async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;
    const result = await userService.resetPassword(token, newPassword);
    res.json(result);
  } catch (error: any) {
    res.status(error.status || 500).json({ message: error.message });
  }



});

export default router;