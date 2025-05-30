import { Request, Response, NextFunction } from "express";
import { z, AnyZodObject } from "zod";
import { ValidationError } from "../utils/errors";

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Transform ZodError errors into Record<string, string[]>
        const formattedErrors: Record<string, string[]> = {};
        error.errors.forEach((err) => {
          const path = err.path.join("."); // e.g., "body.email" or "params.id"
          if (!formattedErrors[path]) {
            formattedErrors[path] = [];
          }
          formattedErrors[path].push(err.message);
        });
        throw new ValidationError("Validation failed", formattedErrors);
      }
      next(error);
    }
  };
};