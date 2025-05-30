import { z } from "zod";

export const createPostSchema = z.object({
  body: z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    body: z.string().min(10, "Body must be at least 10 characters").max(5000),
  }),
});

export const updatePostSchema = z.object({
  params: z.object({
    id: z.string().regex(/^\d+$/, "ID must be a number"),
  }),
  body: z.object({
    title: z.string().min(3).max(100).optional(),
    body: z.string().min(10).max(5000).optional(),
  }),
});