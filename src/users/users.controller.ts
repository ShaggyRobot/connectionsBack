import {
  Res,
  Get,
  Put,
  Post,
  Body,
  Headers,
  UseGuards,
  Controller,
  HttpStatus,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';

import { UsersService } from './users.service';

import { CreateUserDto } from '../auth/dto/create-user.dto';

@Controller()
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/users')
  async getUsers() {
    try {
      return await this.usersService.getUsers();
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/profile')
  async getProfile(@Headers('rs-uid') uidHeader: string) {
    return await this.usersService.getProfile(+uidHeader);
  }

  @Put('/profile')
  async updateProfile(
    @Headers('rs-uid') uidHeader: string,
    @Body() body: { name: string },
    @Res() res: Response,
  ) {
    try {
      if (!body || !body.name) {
        throw new HttpException(
          {
            type: 'InvalidFormDataException',
            message: 'You have to pass "name" field.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      await this.usersService.updateProfile(+uidHeader, body.name);

      res.status(HttpStatus.CREATED).send();
    } catch (e) {
      throw e;
    }
  }
}
