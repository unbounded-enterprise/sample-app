export class CustomError extends Error {
  custom?: string;

  constructor(message: string, custom: string) {
    super(message);
    this.custom = custom;
  }
}

export class BasicError extends Error {
status: number;

constructor(message: string, status: number) {
  super(message);
  this.status = status;
}
}