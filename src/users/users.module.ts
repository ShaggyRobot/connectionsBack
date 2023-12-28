import { Module } from '@nestjs/common';

import { UsersService } from './users.service';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersController } from './users.controller';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, JwtService],
})
export class UsersModule {}
