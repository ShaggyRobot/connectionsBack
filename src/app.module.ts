import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupsModule } from './groups/groups.module';
import { ConversationsModule } from './conversations/conversations.module';
import { AppController } from 'src/app.controller';

@Module({
  imports: [UsersModule, AuthModule, GroupsModule, ConversationsModule],
  controllers: [AppController],
  providers: [PrismaService],
})
export class AppModule {}
