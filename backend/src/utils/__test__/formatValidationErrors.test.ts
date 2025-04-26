// utils/__tests__/formatValidationErrors.test.ts
import { formatValidationErrors } from "../formatValidationErrors";

describe("formatValidationErrors", () => {
  it("should format a single validation error correctly", () => {
    const errors = [{ param: "email", msg: "Email is required" }] as any;

    const result = formatValidationErrors(errors);

    expect(result).toEqual({
      message: "The given data was invalid.",
      errors: {
        email: ["Email is required"],
      },
    });
  });

  it("should format multiple errors for different fields", () => {
    const errors = [
      { param: "name", msg: "Name is required" },
      { param: "email", msg: "Email is invalid" },
    ] as any;

    const result = formatValidationErrors(errors);

    expect(result).toEqual({
      message: "The given data was invalid.",
      errors: {
        name: ["Name is required"],
        email: ["Email is invalid"],
      },
    });
  });

  it("should format multiple errors for the same field", () => {
    const errors = [
      { param: "email", msg: "Email is required" },
      { param: "email", msg: "Email must be valid" },
    ] as any;

    const result = formatValidationErrors(errors);

    expect(result).toEqual({
      message: "The given data was invalid.",
      errors: {
        email: ["Email is required", "Email must be valid"],
      },
    });
  });

  it("should ignore errors without param or msg", () => {
    const errors = [
      { foo: "bar" },
      { param: "email", msg: "Email is required" },
    ] as any;

    const result = formatValidationErrors(errors);

    expect(result).toEqual({
      message: "The given data was invalid.",
      errors: {
        email: ["Email is required"],
      },
    });
  });
});
