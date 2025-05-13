import {
  ValidationErrors,
  VendorProduct,
  VendorProductFormType,
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

export function getPricingRuleMetas(
  pricingRules: VendorProduct["pricingRules"]
) {
  if (!pricingRules)
    return [] as VendorProductFormType["vendorProducts"][number]["pricingRuleMetas"];

  const pricingRuleMetas = pricingRules.reduce<
    VendorProductFormType["vendorProducts"][number]["pricingRuleMetas"]
  >((rules, curr) => {
    const existingRule = rules.find((rl) => rl.attribute === curr.attribute);

    if (!existingRule) {
      return [
        ...rules,
        {
          attribute: curr.attribute,
          values: [curr.value],
          default: 0,
          description: "",
          hasOther: false,
          inputType:
            "radio" as VendorProductFormType["vendorProducts"][number]["pricingRuleMetas"][number]["inputType"],
          required: false,
        } as VendorProductFormType["vendorProducts"][number]["pricingRuleMetas"][number],
      ];
    }

    existingRule.values.push(curr.value);
    return rules;
  }, []);

  return pricingRuleMetas;
}
export const formatDate = (date: Date | string | undefined): string => {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().split("T")[0]; // formats as "yyyy-MM-dd"
};

export function combinePricingRuleMetas(
  vendorProducts: VendorProduct[],
  productId: string
) {
  const matchedVendorProducts = vendorProducts.filter(
    (vp) => vp.product.id === productId
  );
  const combinedPricingRuleMetas = [] as VendorProduct["pricingRuleMetas"];

  for (const VendorProduct of matchedVendorProducts) {
    VendorProduct.pricingRuleMetas.map((meta) => {
      const existingRuleIndex = combinedPricingRuleMetas.findIndex(
        (rl) => rl.attribute === meta.attribute
      );
      if (existingRuleIndex === -1) {
        combinedPricingRuleMetas.push(meta);
      } else {
        const latestDefaultValue = meta.values[meta.default];

        const existingRule = combinedPricingRuleMetas[existingRuleIndex];
        existingRule.values = [
          ...new Set([...existingRule.values, ...meta.values]),
        ] as [string];

        existingRule.default = existingRule.values.findIndex(
          (vl) => vl === latestDefaultValue
        );
      }
    });
  }
  return combinedPricingRuleMetas;
}
