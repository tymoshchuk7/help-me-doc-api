
export const pickFromObject = <R extends Record<string, any>>(obj: object, fields: string[]): R => {
  return fields.reduce((prevValue, key) => {
    const value = obj[key as keyof typeof obj];
    if (value) {
      prevValue[key as keyof R] = value;
    }
    return prevValue;
  }, {} as R);
};

export class ApiError extends Error {
  statusCode?: number;

  errorCode?: string;

  constructor({ message, errorCode, statusCode }: { message: string, statusCode?: number, errorCode?: string }) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}