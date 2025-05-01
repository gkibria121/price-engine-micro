// middleware/errorHandler.ts
import { Request, Response, NextFunction } from "express";
import { ValidationException } from "../Exceptions/ValidationException";
import { CustomException } from "../Contracts/CustomException";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ValidationException) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }
  if (err instanceof CustomException) {
    res.status(err.statusCode).json({
      message: err.message,
      errors: err.errors,
    });
    return;
  }

  console.error(err); // For debugging
  res.status(500).json({ message: "Internal Server Error" });
}
