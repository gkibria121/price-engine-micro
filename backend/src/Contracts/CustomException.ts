import { ValidationErrors } from "../Exceptions/ValidationError";

export interface CustomException {
  message: string;
  statusCode: number;
  errors?: ValidationErrors;
}
