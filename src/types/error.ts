export class CustomError extends Error {
    custom?: string;
  
    constructor(message: string, custom: string) {
      super(message);
      this.custom = custom;
    }
  }
