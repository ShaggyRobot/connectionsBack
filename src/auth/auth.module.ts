import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';

import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [AuthService, PrismaService, UsersService, JwtService],
  controllers: [AuthController],
})
export class AuthModule {}
