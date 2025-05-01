import { ValidationErrors } from "@/types";
import { UseFormReturn, Path } from "react-hook-form";

export async function wait(s: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(s);
    }, s * 1000);
  });
}

export function toInitialCap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function setValidationErrors<T extends Record<string, unknown>>(
  errors: ValidationErrors,
  setError: UseFormReturn<T>["setError"],
  mode: "first" | "all" = "first"
) {
  Object.keys(errors).forEach((key) => {
    const path = key as Path<T>; // ✅ cast to Path<T> for TS compatibility

    const messages = errors[key];
    const message = mode === "all" ? messages.join(", ") : messages[0];

    setError(path, {
      type: "custom",
      message,
    });
  });
}
