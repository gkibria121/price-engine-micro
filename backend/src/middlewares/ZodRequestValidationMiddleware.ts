import { NextFunction, Request, Response } from "express";
import { z, ZodError, ZodIssue } from "zod";
import { formatZodValidationErrors } from "../utils/formatValidationErrors";
import { ValidationException } from "../Exceptions/ValidationException";

// Zod validation middleware for body
export const ZodRequestValidationMiddleware = (
  schema: z.ZodType<any, any, any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate request body using Zod schema

      schema.parse(req.body);
      next(); // Proceed to the next middleware if validation passes
    } catch (error) {
      if (error instanceof ZodError) {
        const { message, errors: validationErrors } = formatZodValidationErrors(
          error.errors
        );
        const exception = new ValidationException(message, validationErrors);
        return next(exception);
      }
      next(error); // Pass other errors to the default error handler
    }
  };
};
