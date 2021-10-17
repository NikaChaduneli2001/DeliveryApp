import { IsInt, IsNumber, IsString } from 'class-validator';

export class createCommentDto {
  @IsNumber()
  @IsInt()
  userId: number;
  @IsNumber()
  @IsInt()
  orderId: number;
  @IsString()
  comment: string;
}
