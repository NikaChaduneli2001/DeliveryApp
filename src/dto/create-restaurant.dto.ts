import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { RestaurantType } from 'src/enums/restaurant-type.enum';

export class CreateRestaurantDto {
  @IsNumber()
  @IsInt()
  userId: number;
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;
  @IsString()
  address: string;
  @IsEnum(RestaurantType)
  type: RestaurantType;
}
