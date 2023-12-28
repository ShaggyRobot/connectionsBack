import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  groupID: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
