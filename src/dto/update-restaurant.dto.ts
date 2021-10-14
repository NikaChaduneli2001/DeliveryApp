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

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name?: string;
  @IsOptional()
  @IsString()
  address?: string;
  @IsOptional()
  @IsEnum(RestaurantType)
  type?: RestaurantType;
}
