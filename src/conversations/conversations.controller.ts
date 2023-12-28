import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Headers,
  Query,
  UseGuards,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';

import { Response } from 'express';

import { AuthGuard } from 'src/auth/auth.guard';

import { ConversationsService } from './conversations.service';

import { MessageDto } from 'src/conversations/dto/message.dto';
import { CreateConversationDto } from './dto/create-conversation.dto';

@Controller('conversations')
@UseGuards(AuthGuard)
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Post('/create')
  create(
    @Body() createConversationDto: CreateConversationDto,
    @Headers('rs-uid') userId: string,
  ) {
    return this.conversationsService.create(createConversationDto, userId);
  }

  @Get('/list')
  findAll(@Headers('rs-uid') userId: string) {
    return this.conversationsService.findAll(userId);
  }

  @Get('/read')
  readMessages(
    @Query('conversationID') conversationID: string,
    @Query('since') since?: string,
  ) {
    return this.conversationsService.readMessages(conversationID, since);
  }

  @Post('/append')
  async appendMessage(
    @Body() body: MessageDto,
    @Headers('rs-uid') userId: string,
    @Res() res: Response,
  ) {
    await this.conversationsService.appendMessage(body, +userId);

    res.status(HttpStatus.OK).send();
  }

  @Delete('/delete')
  async remove(
    @Query('conversationID') conversationID: string,
    @Res() res: Response,
  ) {
    if (!conversationID)
      throw new HttpException(
        {
          type: 'InvalidFormDataException',
          message: '"conversationID" parameter should be in query list.',
        },
        HttpStatus.BAD_REQUEST,
      );

    await this.conversationsService.remove(+conversationID);
    res.status(HttpStatus.OK).send();
  }
}
