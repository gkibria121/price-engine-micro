import { CustomException } from "../Contracts/CustomException";

export class NotFoundException extends CustomException {
  message: string = "Page Not Found!";
  statusCode: number = 404;
  constructor(message?: string) {
    super(message);
    this.message = message ?? this.message;
  }
}
