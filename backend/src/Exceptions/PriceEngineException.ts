import { CustomException } from "../Contracts/CustomException";

export class PriceEngineException extends CustomException {
  message: string = "Unable to calculate price!";
  statusCode: number = 400;
  constructor(message?: string) {
    super(message);
    this.message = message ?? this.message;
  }
}
