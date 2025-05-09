// utils/formatValidationErrors.ts
import { ValidationError, FieldValidationError } from "express-validator";
import { ZodIssue } from "zod";
import { ValidationErrors } from "../Exceptions/ValidationError";

export function formatValidationErrors(errors: ValidationError[]) {
  const formatted: Record<string, string[]> = {};
  errors.forEach((error) => {
    const fieldError = error as FieldValidationError;
    if (fieldError.type !== "field") return;
    const formattedPath =
      fieldError.path?.replace(/\[(\d+)\]/g, ".$1") ?? fieldError.path;
    if (!formatted[formattedPath]) {
      formatted[formattedPath] = [];
    }

    formatted[formattedPath].push(fieldError.msg);
  });
  return {
    message: "The given data was invalid.",
    errors: formatted,
  };
}

export function formatZodValidationErrors(errors: ZodIssue[]) {
  const formatted: Record<string, string[]> = {};
  errors.forEach((error) => {
    const fieldError = error as ZodIssue;

    const formattedPath = fieldError.path.join(".");
    if (!formatted[formattedPath]) {
      formatted[formattedPath] = [];
    }

    formatted[formattedPath].push(fieldError.message);
  });
  return {
    message: "The given data was invalid.",
    errors: formatted,
  };
}
