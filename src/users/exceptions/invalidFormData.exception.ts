import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidFormDataException extends HttpException {
  constructor() {
    super(
      {
        type: 'InvalidFormDataException',
        message: 'Parameters "email", "name" and "password" are required',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
