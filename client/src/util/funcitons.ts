import { ValidationErrors } from "@/types";
import { UseFormReturn, Path } from "react-hook-form";
import { Id, ToastContent, ToastOptions } from "react-toastify";

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
  setError?: UseFormReturn<T>["setError"],
  toast?: (
    content: ToastContent<unknown>,
    options?: ToastOptions<unknown>
  ) => Id,
  mode: "first" | "all" | "toast" = "first"
) {
  Object.keys(errors).forEach((key) => {
    const path = key as Path<T>; // ✅ cast to Path<T> for TS compatibility

    const messages = errors[key];
    if (mode == "toast" && toast) {
      messages.forEach((m) => {
        toast(m, {
          type: "error",
        });
      });
    }
    const message = mode === "all" ? messages.join(", ") : messages[0];
    if (mode !== "toast" && setError)
      setError(path, {
        type: "custom",
        message,
      });
  });
}
