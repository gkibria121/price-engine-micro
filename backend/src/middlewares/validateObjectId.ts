// middleware/validateObjectId.ts
import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { InvalidObjectIdException } from "../Exceptions/InvalidObjectIdException";

export function validateObjectId(paramName: string = "id") {
  return (req: Request, res: Response, next: NextFunction) => {
    const id =
      req.params[paramName] || req.body[paramName] || req.query[paramName];

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new InvalidObjectIdException();
    }

    next();
  };
}
