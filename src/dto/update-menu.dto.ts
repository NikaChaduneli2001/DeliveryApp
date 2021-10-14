import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { MenuType } from 'src/enums/menu-type.enum';

export class updateMenuDto {
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
  @IsString()
  @MaxLength(700)
  @MinLength(3)
  sumbnail: string;
}
