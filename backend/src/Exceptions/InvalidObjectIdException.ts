import { CustomException } from "../Contracts/CustomException";
import { ValidationErrors } from "./ValidationError";

export class InvalidObjectIdException extends CustomException {
  message: string = "Invalid ObjectId format";
  statusCode: number = 400;
}
