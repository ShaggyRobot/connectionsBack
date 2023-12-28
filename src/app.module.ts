import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaService } from 'src/prisma/prisma.service';
import { GroupsModule } from './groups/groups.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [UsersModule, AuthModule, GroupsModule, ConversationsModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
