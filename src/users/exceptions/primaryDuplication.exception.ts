import { HttpException, HttpStatus } from '@nestjs/common';

export class PrimaryDuplicationException extends HttpException {
  constructor(email: string) {
    super(
      {
        type: 'PrimaryDuplicationException',
        message: `User ${email} already exists`,
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
