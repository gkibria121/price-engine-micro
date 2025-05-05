// middleware/validateRequest.ts
import { Request, Response, NextFunction } from "express";
import { FieldValidationError, validationResult } from "express-validator";
import { ValidationException } from "../Exceptions/ValidationException";
import { formatValidationErrors } from "../utils/formatValidationErrors";
import { z, ZodError } from "zod";

export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // Pass errors to the global error handler
    const { message, errors: validationErrors } = formatValidationErrors(
      errors.array()
    );
    const error = new ValidationException(message, validationErrors);
    return next(error);
  }
  next();
}
