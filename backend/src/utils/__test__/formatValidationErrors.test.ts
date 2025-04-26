import { formatValidationErrors } from "../formatValidationErrors";

describe("formatValidationErrors", () => {
  it("should format a single validation error correctly", () => {
    const errors = [
      { type: "field", path: "email", msg: "Email is required" },
    ] as any;

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
      { type: "field", path: "name", msg: "Name is required" },
      { type: "field", path: "email", msg: "Email is invalid" },
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
      { type: "field", path: "email", msg: "Email is required" },
      { type: "field", path: "email", msg: "Email must be valid" },
    ] as any;

    const result = formatValidationErrors(errors);

    expect(result).toEqual({
      message: "The given data was invalid.",
      errors: {
        email: ["Email is required", "Email must be valid"],
      },
    });
  });

  it("should ignore non-field errors", () => {
    const errors = [
      { type: "unknown", path: "email", msg: "Should not include" },
      { type: "field", path: "email", msg: "Email is required" },
    ] as any;

    const result = formatValidationErrors(errors);

    expect(result).toEqual({
      message: "The given data was invalid.",
      errors: {
        email: ["Email is required"],
      },
    });
  });

  it("should return empty errors if no field errors are present", () => {
    const errors = [
      { type: "unknown", path: "something", msg: "Error message" },
    ] as any;

    const result = formatValidationErrors(errors);

    expect(result).toEqual({
      message: "The given data was invalid.",
      errors: {},
    });
  });
});
