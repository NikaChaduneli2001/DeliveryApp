import {
  IsEnum,
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Stars } from 'src/enums/stars.enum';

export class MakeReviewDTO {
  @IsString()
  @MaxLength(300)
  @MinLength(3)
  comment: string;
  @IsEnum(Stars)
  stars: Stars;
  @IsNumber()
  @IsInt()
  orderId: number;
  @IsNumber()
  @IsInt()
  restaurantId: number;
}
