import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDto {
  @IsString()
  @IsNotEmpty()
  conversationID: string;

  @IsString()
  @IsNotEmpty()
  message: string;
}
