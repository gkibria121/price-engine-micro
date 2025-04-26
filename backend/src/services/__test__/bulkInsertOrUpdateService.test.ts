// __tests__/services/bulkInsertOrUpdateService.test.ts

import {
  validateBulkInput,
  extractUniqueVendorProductIdentifiers,
  validatePricingRule,
  validateDeliverySlot,
  validateQuantityPricing,
} from "../../services/bulkInsertOrUpdateService";
import { CustomValidationException } from "../../Exceptions/CustomValidationException";

describe("bulkInsertOrUpdateService", () => {
  describe("validateBulkInput", () => {
    it("should pass with valid arrays", () => {
      expect(() => validateBulkInput([], [], [])).not.toThrow();
    });

    it("should throw if any input is not an array", () => {
      // @ts-ignore
      expect(() => validateBulkInput({}, [], [])).toThrow(
        CustomValidationException
      );
    });

    it("should throw if items are missing product_name or vendor_email", () => {
      expect(() =>
        validateBulkInput([{ vendor_email: "test" }], [], [])
      ).toThrow(CustomValidationException);
    });
  });

  describe("extractUniqueVendorProductIdentifiers", () => {
    it("should return unique vendor-product combinations", () => {
      const input = [
        { product_name: "A", vendor_email: "x@example.com" },
        { product_name: "A", vendor_email: "x@example.com" },
        { product_name: "B", vendor_email: "y@example.com" },
      ];
      const result = extractUniqueVendorProductIdentifiers(input);
      expect(result.length).toBe(2);
    });
  });

  describe("validatePricingRule", () => {
    it("should pass for valid pricing rule", () => {
      expect(() =>
        validatePricingRule({
          attribute: "color",
          value: "red",
          price: 100,
        })
      ).not.toThrow();
    });

    it("should throw for invalid pricing rule", () => {
      expect(() =>
        validatePricingRule({
          attribute: "color",
          value: "red",
          price: "bad",
        })
      ).toThrow(CustomValidationException);
    });
  });

  describe("validateDeliverySlot", () => {
    it("should throw for invalid delivery slot", () => {
      expect(() =>
        validateDeliverySlot({
          label: 123,
          price: 200,
        })
      ).toThrow(CustomValidationException);
    });
  });

  describe("validateQuantityPricing", () => {
    it("should throw for invalid quantity pricing", () => {
      expect(() =>
        validateQuantityPricing({
          quantity: "5",
          price: 100,
        })
      ).toThrow(CustomValidationException);
    });
  });
});
