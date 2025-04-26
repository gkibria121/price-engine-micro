// middleware/__tests__/validateRequest.test.ts
import { validateRequest } from "../ValidateRequestMiddleware";
import { validationResult } from "express-validator";
import { ValidationException } from "../../Exceptions/ValidationException";

// Mock validationResult from express-validator
jest.mock("express-validator", () => ({
  validationResult: jest.fn(),
}));

const mockRequest = {} as any;
const mockResponse = {} as any;

describe("validateRequest middleware", () => {
  it("should call next() if there are no validation errors", () => {
    const next = jest.fn();

    // Cast as jest.Mock to avoid TS error
    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => true,
    });

    validateRequest(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalledWith();
  });

  it("should call next() with ValidationException if there are validation errors", () => {
    const next = jest.fn();

    const errorsArray = [
      { type: "field", path: "email", msg: "Email is required" },
      { type: "field", path: "name", msg: "Name is required" },
    ];

    (validationResult as unknown as jest.Mock).mockReturnValue({
      isEmpty: () => false,
      array: () => errorsArray,
    });

    validateRequest(mockRequest, mockResponse, next);

    expect(next).toHaveBeenCalledTimes(1);

    const error = next.mock.calls[0][0];
    expect(error).toBeInstanceOf(ValidationException);
    expect(error.message).toBe("The given data was invalid.");

    expect(error.errors).toEqual({
      email: ["Email is required"],
      name: ["Name is required"],
    });
  });
});
