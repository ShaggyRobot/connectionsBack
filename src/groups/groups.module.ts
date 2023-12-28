import { Module } from '@nestjs/common';

import { GroupsController } from './groups.controller';

import { JwtService } from '@nestjs/jwt';
import { GroupsService } from './groups.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [GroupsController],
  providers: [GroupsService, PrismaService, JwtService],
})
export class GroupsModule {}
