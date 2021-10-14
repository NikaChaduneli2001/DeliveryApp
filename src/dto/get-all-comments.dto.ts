import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { MenuType } from 'src/enums/menu-type.enum';

enum SortDir {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class getAllCommentsDto {
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsEnum(SortDir)
  sortDir?: SortDir;
  @Type(() => {
    return Number;
  })
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
