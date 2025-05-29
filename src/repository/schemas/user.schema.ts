import { updateUserSchema } from './user.schema';
import {z} from "zod"

import { emailSchema,passwordSchema,nameSchema } from "./common.schemas"
import { email } from "zod/v4"

export const createUserSchema=z.object({
    body:z.object({
        name: nameSchema,
        email: emailSchema,
        password: passwordSchema,
        role: z.enum(['user','admin']).default('user')
    })
})

export const updateUserSchema= z.object({
    body:z.object({
name:nameSchema.optional(),
email:emailSchema.optional(),
role:z.enum(["user","admin"]).optional(),
isActive:z.boolean().optional(),


    })

    .refine((data)=> Object.keys(data).length >0,{
    message:"At least one field must be provided"}),
});

export type CreatUserInput= z.infer <typeof createUserSchema>
export type updateUserInput= z.infer< typeof updateUserSchema>