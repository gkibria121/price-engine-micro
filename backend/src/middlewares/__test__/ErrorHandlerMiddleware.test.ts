// middleware/__tests__/errorHandler.test.ts
import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../ErrorHandlerMiddleware";
import { ValidationException } from "../../Exceptions/ValidationException";

describe("errorHandler middleware", () => {
  it("should return 400 with validation error details when ValidationException is thrown", () => {
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();

    const error = new ValidationException("Validation failed", {
      email: ["Email is required"],
    });
    error.statusCode = 400; // Assuming the statusCode is set on ValidationException

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Validation failed",
      errors: { email: ["Email is required"] },
    });
  });

  it("should return 500 with a generic error message for other errors", () => {
    const mockRequest = {} as Request;
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;
    const mockNext = jest.fn();

    const error = new Error("Some unexpected error");

    errorHandler(error, mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
