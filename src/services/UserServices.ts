import { UserRepository } from "../repository/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../entities/User"; // Added import for User entity

export class UserService {
  async register(name: string, email: string, password: string) {
    if (!name || !email || !password) {
      throw { status: 400, message: "All fields are required" };
    }

    const existingUser = await UserRepository.findByEmail(email);
    if (existingUser) {
      throw { status: 400, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: Partial<User> = { name, email, password: hashedPassword }; // Explicitly type as Partial<User>
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
}