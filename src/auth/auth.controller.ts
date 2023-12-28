import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Post,
  Res,
  UseGuards,
  Headers,
  InternalServerErrorException,
} from '@nestjs/common';

import { Response } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { InvalidFormDataException } from 'src/users/exceptions/invalidFormData.exception';
import { PrimaryDuplicationException } from 'src/users/exceptions/primaryDuplication.exception';

import { LoginUserDto } from 'src/auth/dto/login-user.dto';
import { CreateUserDto } from 'src/auth/dto/create-user.dto';

import { AuthService } from 'src/auth/auth.service';
import { UsersService } from 'src/users/users.service';

@Controller()
export class AuthController {
  constructor(
    private users: UsersService,
    private auth: AuthService,
  ) {}

  @Post('/registration')
  async register(@Body() dto: CreateUserDto, @Res() res: Response) {
    try {
      await this.users.create(dto);
      res.status(HttpStatus.CREATED).send();
    } catch (e) {
      if (
        e instanceof PrimaryDuplicationException ||
        e instanceof InvalidFormDataException
      ) {
        throw e;
      }

      throw new InternalServerErrorException();
    }
  }

  @Post('/login')
  login(@Body() dto: LoginUserDto) {
    return this.auth.login(dto);
  }

  @Delete('/logout')
  @UseGuards(AuthGuard)
  async logout(@Headers('rs-uid') uid: string, @Res() res: Response) {
    try {
      await this.auth.logout(uid);
      res.status(HttpStatus.OK).send();
    } catch (e) {
      throw e;
    }
  }
}
