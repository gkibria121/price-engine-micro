import {
  PricingRuleSelectionType,
  ValidationErrors,
  VendorProduct,
} from "@/types";
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
  if (!s) return "";
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
  Object.keys(errors ?? []).forEach((key) => {
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
// Helper functions
export function extractUniqueVendorProductIdentifiers(
  combinedData: { product_name: string; vendor_email: string }[]
) {
  return combinedData.reduce(
    (acc: { product_name: string; vendor_email: string }[], curr) => {
      if (
        !acc.some(
          (el) =>
            el.vendor_email === curr.vendor_email &&
            el.product_name === curr.product_name
        )
      ) {
        acc.push(curr);
      }
      return acc;
    },
    []
  );
}
export function toTitleCase(str: string) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
// Convert Title Case to snake_case
export function titleToSnake(title) {
  return title.trim().toLowerCase().replace(/\s+/g, "_"); // replace spaces with underscores
}
// Convert snake_case to Title Case
export function snakeToTitle(snake) {
  return snake
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // capitalize each word
    .join(" ");
}

export function getPricingRuleOptions(vendorProduct?: VendorProduct) {
  if (!vendorProduct) return [] as PricingRuleSelectionType[];

  const pricingRules = vendorProduct.pricingRules;

  const pricingRuleOptions = pricingRules.reduce<PricingRuleSelectionType[]>(
    (rules, curr) => {
      const existingRule = rules.find((rl) => rl.attribute === curr.attribute);

      if (!existingRule) {
        return [
          ...rules,
          {
            attribute: curr.attribute,
            values: [curr.value],
            default: 0,
            description: "",
            hasOther: true,
            inputType: "radio",
            required: false,
          } as PricingRuleSelectionType,
        ];
      }

      if (curr.isDefault) {
        existingRule.default = existingRule.values.length;
      }
      existingRule.values.push(curr.value);
      return rules;
    },
    []
  );

  return pricingRuleOptions;
}
