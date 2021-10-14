import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MenuType } from 'src/enums/menu-type.enum';

enum SortDir {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class searchBy {
  @IsOptional()
  @IsString()
  itemName: string;
  @IsEnum(MenuType)
  @IsString()
  type: MenuType;
}
export class getAllMenuDto {
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsEnum(SortDir)
  sortDir?: SortDir;
  @Type(() => {
    return Number;
  })
  @Type(() => searchBy)
  @IsString()
  searchBy?: searchBy;
  @IsOptional()
  @IsNumber()
  page?: number;
  @Type(() => {
    return Number;
  })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
