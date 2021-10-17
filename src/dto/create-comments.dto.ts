import { IsInt, IsNumber, IsString } from 'class-validator';

export class createCommentDto {
  @IsInt()
  userId: number;
  @IsInt()
  orderId: number;
  @IsString()
  comment: string;
}
