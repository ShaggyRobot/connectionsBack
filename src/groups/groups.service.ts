import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { MessageDto } from 'src/groups/dto/message.dto';
import { CreateGroupDto } from './dto/create-group.dto';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  async create(createGroupDto: CreateGroupDto, id: string) {
    const group = await this.prisma.groupConversation.create({
      data: {
        title: createGroupDto.name,
        createdBy: +id,
      },
    });

    return { groupID: group.id.toString() };
  }

  async findAll() {
    return await this.prisma.groupConversation.findMany();
  }

  async readMessages(id: string, since: number = 0) {
    try {
      await this.prisma.groupConversation.findUniqueOrThrow({
        where: { id: +id },
      });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new HttpException(
          {
            type: 'InvalidIDException',
            message:
              'Group with id "{groupID}" does not exist or was removed before.',
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    const messages = await this.prisma.message.findMany({
      where: {
        groupConversationId: +id,
        ...(since && { createdAt: { gt: new Date(since) } }),
      },
    });

    const Items = messages.map((message) => ({
      authorID: {
        S: message.authorId.toString(),
      },
      message: {
        S: message.text,
      },
      createdAt: {
        S: new Date(message.createdAt).getTime().toString(),
      },
    }));

    return {
      Count: messages.length,
      Items,
    };
  }

  async appendMessage({ groupID, message }: MessageDto, uid: string) {
    await this.prisma.message.create({
      data: {
        groupConversationId: +groupID,
        text: message,
        authorId: +uid,
      },
    });
  }

  async remove(id: number) {
    const removedGroup = await this.prisma.groupConversation.delete({
      where: { id },
    });

    return removedGroup;
  }
}
