// utils/formatValidationErrors.ts
import { ValidationError, FieldValidationError } from "express-validator";

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
