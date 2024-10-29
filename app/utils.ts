
export class ApiError extends Error {
  statusCode?: number;

  errorCode?: string;

  constructor({ message, errorCode, statusCode }: { message: string, statusCode?: number, errorCode?: string }) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}