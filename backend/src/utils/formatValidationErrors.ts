// utils/formatValidationErrors.ts
import { ValidationError } from "express-validator";

type FieldError = {
  param: string;
  msg: string;
};

function isFieldError(error: any): error is FieldError {
  return typeof error.param === "string" && typeof error.msg === "string";
}

export function formatValidationErrors(errors: ValidationError[]) {
  const formatted: Record<string, string[]> = {};

  errors.forEach((error) => {
    if (!isFieldError(error)) return;

    if (!formatted[error.param]) {
      formatted[error.param] = [];
    }

    formatted[error.param].push(error.msg);
  });

  return {
    message: "The given data was invalid.",
    errors: formatted,
  };
}
