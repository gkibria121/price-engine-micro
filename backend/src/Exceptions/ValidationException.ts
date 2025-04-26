import { CustomException } from "../Contracts/CustomException";
import { ValidationErrors } from "./ValidationError";

export class ValidationException extends CustomException {
  statusCode: number = 422;
  constructor(public message: string, public errors: ValidationErrors) {
    super(message);
  }
}
