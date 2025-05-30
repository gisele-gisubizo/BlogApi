import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  name!: string;

  @Column({ length: 100, unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "varchar", length: 20, default: "user" })
  role!: "user" | "admin";

  @Column({ type: "boolean", default: false })
  isVerified!: boolean;

  @Column({ type: "boolean", default: true })
  isActive!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ type: "text", nullable: true })
  resetPasswordToken?: string | null;

  @Column({ type: "timestamp", nullable: true })
  resetPasswordExpires?: Date | null;
}