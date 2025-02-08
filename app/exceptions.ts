interface ExceptionParams {
  message: string,
  statusCode?: number,
  errorCode?: string,
}

export class ApiException extends Error {
  statusCode?: number;

  errorCode?: string;

  constructor({ message, errorCode, statusCode }: ExceptionParams) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

export class NotFoundException extends ApiException {

  statusCode?: number;

  errorCode?: string;

  constructor({ message, errorCode }: Omit<ExceptionParams, 'statusCode'>) {
    super({
      message,
      errorCode,
      statusCode: 404,
    });
  }
}