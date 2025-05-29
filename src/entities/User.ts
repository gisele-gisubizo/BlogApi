import { generateResetToken } from './../utils/jwt';
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

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({type:'text',nullable:true})
 resetPasswordToken?:string |null;

  @Column({type:'text',nullable:true})
resetPasswordExpires?:Date |null;

}