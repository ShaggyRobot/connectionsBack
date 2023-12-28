import {
  Res,
  Get,
  Post,
  Body,
  Query,
  Delete,
  Headers,
  UseGuards,
  Controller,
  HttpStatus,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';

import { GroupsService } from './groups.service';

import { Response } from 'express';

import { MessageDto } from 'src/groups/dto/message.dto';
import { CreateGroupDto } from './dto/create-group.dto';

@Controller('groups')
@UseGuards(AuthGuard)
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post('/create')
  create(
    @Body() createGroupDto: CreateGroupDto,
    @Headers('rs-uid') uidHeader: string,
  ) {
    return this.groupsService.create(createGroupDto, uidHeader);
  }

  @Get('/list')
  async findAll() {
    const groups = await this.groupsService.findAll();
    const Items = groups.map((group) => ({
      id: {
        S: group.id.toString(),
      },
      name: {
        S: group.title,
      },
      createdAt: {
        S: new Date(group.createdAt).getTime().toString(),
      },
      createdBy: {
        S: group.createdBy.toString(),
      },
    }));

    return {
      Count: groups.length,
      Items,
    };
  }

  @Get('/read')
  readMessages(
    @Query('groupID') groupID: string,
    @Query('since') since?: string,
  ) {
    return this.groupsService.readMessages(groupID, +since);
  }

  @Post('/append')
  append(@Body() body: MessageDto, @Headers('rs-uid') uid: string) {
    return this.groupsService.appendMessage(body, uid);
  }

  @Delete('/delete')
  async remove(@Query('groupID') id: string, @Res() res: Response) {
    await this.groupsService.remove(+id);

    res.status(HttpStatus.OK).send();
  }
}
