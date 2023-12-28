import {
  HttpStatus,
  Injectable,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { PrismaService } from 'src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto } from 'src/auth/dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async login(dto: LoginUserDto) {
    const { email, password } = dto;

    const user = await this.prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new HttpException(
        {
          type: 'NotFoundException',
          message: 'Email and/or password doesn`t exist in the system.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const hashMatch = await bcrypt.compare(password, user.passwordHash);

    if (!hashMatch) {
      throw new HttpException(
        {
          type: 'NotFoundException',
          message: 'Email and/or password doesn`t exist in the system.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    try {
      const userUpdated = await this.prisma.user.update({
        where: { id: user.id },
        data: { sessionId: crypto.randomUUID() },
      });
      const token = this.jwt.sign(
        { userId: userUpdated.id, sessionId: userUpdated.sessionId },
        { secret: process.env.JWT_SECRET },
      );

      return { token, uid: user.id.toString() };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async logout(uid: string) {
    try {
      const user = await this.prisma.user.update({
        where: {
          id: +uid,
        },
        data: {
          sessionId: crypto.randomUUID(),
        },
      });

      return user;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }
}
