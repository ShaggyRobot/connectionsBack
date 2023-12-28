import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

import { MessageDto } from 'src/conversations/dto/message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Injectable()
export class ConversationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createConversationDto: CreateConversationDto, userId: string) {
    try {
      const conversation = await this.prisma.personalConversation.create({
        data: {
          initiatorId: +userId,
          recipientId: +createConversationDto.companion,
        },
      });

      return {
        conversationID: conversation.id.toString(),
      };
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(userId: string) {
    const conversations = await this.prisma.personalConversation.findMany({
      where: { OR: [{ initiatorId: +userId }, { recipientId: +userId }] },
    });

    const Items = conversations.map((conversation) => ({
      id: {
        S: conversation.id.toString(),
      },
      companionID: {
        S:
          conversation.recipientId === +userId
            ? conversation.initiatorId.toString()
            : conversation.recipientId.toString(),
      },
    }));

    return {
      Count: conversations.length,
      Items,
    };
  }

  async readMessages(conversationID: string, since?: string) {
    try {
      await this.prisma.personalConversation.findUniqueOrThrow({
        where: {
          id: +conversationID,
        },
      });

      const messages = await this.prisma.message.findMany({
        where: {
          personalConversationId: +conversationID,
          ...(since && {
            createdAt: {
              gt: new Date(+since),
            },
          }),
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
    } catch (e) {
      if (e.code === 'P2025') {
        throw new HttpException(
          {
            type: 'InvalidIDException',
            message: `Conversation with id ${conversationID} does not exist or was deleted before.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }
  }

  async appendMessage(message: MessageDto, authorId: number) {
    try {
      const createdMessage = await this.prisma.message.create({
        data: {
          authorId,
          personalConversationId: +message.conversationID,
          text: message.message,
        },
      });

      return createdMessage;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.personalConversation.delete({
        where: { id },
      });
    } catch (e) {
      if (e.code === 'P2025') {
        throw new HttpException(
          {
            type: 'InvalidIDException',
            message: `Conversation with id ${id} does not exist or was removed before.`,
          },
          HttpStatus.BAD_REQUEST,
        );
      }
      throw new InternalServerErrorException();
    }
  }
}
