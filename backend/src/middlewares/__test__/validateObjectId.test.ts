// __tests__/middleware/validateObjectId.test.ts
import { validateObjectId } from "../validateObjectId";
import { InvalidObjectIdException } from "../../Exceptions/InvalidObjectIdException";
import mongoose from "mongoose";

describe("validateObjectId middleware", () => {
  const next = jest.fn();
  const res = {} as any; // Not used in middleware

  it("should call next if ObjectId is valid (from params)", () => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    const req = {
      params: { id: validId },
      body: {},
      query: {},
    } as any;

    validateObjectId()(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should call next if ObjectId is valid (from body)", () => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    const req = {
      params: {},
      body: { id: validId },
      query: {},
    } as any;

    validateObjectId()(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should call next if ObjectId is valid (from query)", () => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    const req = {
      params: {},
      body: {},
      query: { id: validId },
    } as any;

    validateObjectId()(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw InvalidObjectIdException if ObjectId is invalid", () => {
    const invalidId = "12345";
    const req = {
      params: { id: invalidId },
      body: {},
      query: {},
    } as any;

    expect(() => validateObjectId()(req, res, next)).toThrow(
      InvalidObjectIdException
    );
  });

  it("should validate with custom paramName", () => {
    const validId = new mongoose.Types.ObjectId().toHexString();
    const req = {
      params: { customId: validId },
      body: {},
      query: {},
    } as any;

    validateObjectId("customId")(req, res, next);

    expect(next).toHaveBeenCalled();
  });

  it("should throw error when custom paramName is invalid", () => {
    const invalidId = "invalid123";
    const req = {
      params: { customId: invalidId },
      body: {},
      query: {},
    } as any;

    expect(() => validateObjectId("customId")(req, res, next)).toThrow(
      InvalidObjectIdException
    );
  });
});
