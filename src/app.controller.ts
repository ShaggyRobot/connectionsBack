import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class AppController {
  @Get()
  respond(@Res() res: Response) {
    res.status(HttpStatus.OK).send();
  }
}
