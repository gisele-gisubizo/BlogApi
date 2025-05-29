import { UserRepository } from "../repository/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User";
import { EmailService } from "../utils/emailService";

export class UserService {
  private emailService = new EmailService();

  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw { status: 400, message: "All fields are required" };
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 400, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: Partial<User> = { name, email, password: hashedPassword };
    const user = await UserRepository.createUser(userData);
    return { message: "User registered successfully" };
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw { status: 400, message: "All fields are required" };
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: "Invalid credentials" };
    }

    if (!process.env.JWT_SECRET) {
      throw { status: 500, message: "JWT secret not configured" };
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    return { token };
  }

  async getProfile(userId: number) {
    try {
      const user = await UserRepository.findUserById(userId);
      return { id: user.id, name: user.name, email: user.email };
    } catch (error: any) {
      throw { status: 404, message: error.message || "User not found" };
    }
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw { status: 400, message: "Email is required" };
    }

    const user = await UserRepository.findByEmail(email);
    if (!user) {
      console.log(email);
      throw { status: 404, message: "User not found" };
    }

    if (!process.env.JWT_SECRET) {
      throw { status: 500, message: "JWT secret not configured" };
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

    // Save the updated user to the database
    try {
      await UserRepository.save(user);
      console.log("Reset token saved for user:", { email, resetPasswordToken: user.resetPasswordToken });
    } catch (error) {
      console.error("Error saving reset token:", error);
      throw { status: 500, message: "Failed to save reset token" };
    }

    await this.emailService.sendResetPasswordEmail(user.email, token);

    return { message: "Password reset email sent" };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw { status: 400, message: "Token and new password are required" };
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      const user = await UserRepository.findByResetToken(token); // Use custom method

      if (!user) {
        throw { status: 400, message: "Invalid or expired token" };
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await UserRepository.save(user);

      return { message: "Password reset successfully" };
    } catch (error: any) {
      throw { status: 400, message: "Invalid or expired token" };
    }
  }
}