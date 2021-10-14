import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MenuType } from 'src/enums/menu-type.enum';

export class createMenuDto {
  @IsNumber()
  @IsInt()
  restaurantId: number;
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  itemName: string;
  @IsEnum(MenuType)
  type: MenuType;
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  description: string;
  @IsNumber()
  price: number;
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
  @IsString()
  @MaxLength(700)
  @MinLength(3)
  sumbnail: string;
}
