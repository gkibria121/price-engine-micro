import { ValidationErrors } from "../Exceptions/ValidationError";

export abstract class CustomException extends Error {
  abstract message: string;
  abstract statusCode: number;
  errors?: ValidationErrors;
}
