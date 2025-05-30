import { AppDataSource } from "../config/database";
import { User } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { EmailService } from "../utils/EmailService";
import { ValidationError, NotFoundError, ConflictError, UnauthorizedError, ForbiddenError } from "../utils/errors";

export class UserService {
  
  private userRepository = AppDataSource.getRepository(User);
  private emailService = new EmailService();

  async register(name: string, email: string, password: string, role: "user" | "admin" = "user") {
    if (!name || !email || !password) {
      throw new ValidationError("All fields are required", {});
    }

    const existingUser = await this.userRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictError("User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const userData: Partial<User> = { name, email, password: hashedPassword, role, isVerified: false, isActive: true };
    const user = await this.userRepository.save(this.userRepository.create(userData));

    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET!, { expiresIn: "24h" });
    const verifyLink = `${process.env.RESET_PASSWORD_URL}/reset-password/${token}`; // Updated to use backend URL with path parameter
    await this.emailService.sendVerificationEmail(user.email, verifyLink);

    return {
      success: true,
      message: "User registered successfully. Please check your email to verify your account.",
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    };
  }

  async verifyEmail(token: string) {
    if (!token) {
      throw new ValidationError("Token is required", {});
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
      const user = await this.userRepository.findOneBy({ id: decoded.userId });

      if (!user) {
        throw new NotFoundError("User");
      }

      if (user.isVerified) {
        throw new ConflictError("Email is already verified");
      }

      user.isVerified = true;
      await this.userRepository.save(user);
      return { success: true, message: "Email verified successfully" };
    } catch (error) {
      throw new ValidationError("Invalid or expired token", {});
    }
  }

  async login(email: string, password: string) {
    if (!email || !password) {
      throw new ValidationError("All fields are required", {});
    }

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new UnauthorizedError("Invalid credentials");
    }

    if (!user.isVerified) {
      throw new ForbiddenError("Please verify your email before logging in");
    }

    if (!user.isActive) {
      throw new ForbiddenError("Your account has been deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid credentials");
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role }, process.env.JWT_SECRET!, { expiresIn: "1h" });
    return {
      success: true,
      message: "Login successful",
      data: {
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        token,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new NotFoundError("User");
    }
    return {
      success: true,
      message: "User retrieved successfully",
      data: { user: { id: user.id, name: user.name, email: user.email, role: user.role } },
    };
  }

  async forgotPassword(email: string) {
    if (!email) {
      throw new ValidationError("Email is required", {});
    }

    const user = await this.userRepository.findOneBy({ email });
    if (!user) {
      throw new NotFoundError("No user found with that email address");
    }

    const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET!, { expiresIn: "15m" });
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await this.userRepository.save(user);
    const resetLink = `${process.env.RESET_PASSWORD_URL}/reset-password?token=${token}`;
    await this.emailService.sendResetPasswordEmail(user.email, resetLink);

    return { success: true, message: "Password reset link sent to your email" };
  }

  async resetPassword(token: string, newPassword: string) {
    if (!token || !newPassword) {
      throw new ValidationError("Token and new password are required", {});
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
      const user = await this.userRepository.findOneBy({ email: decoded.email });

      if (!user || user.resetPasswordToken !== token || !user.resetPasswordExpires || user.resetPasswordExpires < new Date()) {
        throw new ValidationError("Invalid or expired token", {});
      }

      user.password = await bcrypt.hash(newPassword, 10);
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;
      await this.userRepository.save(user);

      return { success: true, message: "Password reset successfully" };
    } catch (error) {
      throw new ValidationError("Invalid or expired token", {});
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: parseInt(id) });
    if (!user) {
      throw new NotFoundError("User");
    }
    return user;
  }

  async findByName(name: string): Promise<User[]> {
    return await this.userRepository
      .createQueryBuilder("user")
      .where("LOWER(user.name) LIKE LOWER(:name)", { name: `%${name}%` })
      .getMany();
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email });
  }

  async update(id: string, updatedData: Partial<User>): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: parseInt(id) });
    if (!user) {
      throw new NotFoundError("User");
    }

    if (updatedData.email && updatedData.email !== user.email) {
      const userWithEmail = await this.userRepository.findOneBy({ email: updatedData.email });
      if (userWithEmail) {
        throw new ConflictError("Email is already in use");
      }
    }

    if (updatedData.password) {
      updatedData.password = await bcrypt.hash(updatedData.password, 10);
    }

    Object.assign(user, updatedData);
    return await this.userRepository.save(user);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.userRepository.delete(parseInt(id));
    return result.affected ? result.affected > 0 : false;
  }
}