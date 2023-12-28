import { Module } from '@nestjs/common';

import { ConversationsController } from './conversations.controller';

import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ConversationsService } from './conversations.service';

@Module({
  controllers: [ConversationsController],
  providers: [ConversationsService, PrismaService, JwtService],
})
export class ConversationsModule {}
