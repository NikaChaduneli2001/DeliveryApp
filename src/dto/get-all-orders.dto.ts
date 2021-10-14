import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';

enum SortDir {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class GetAllOrdersDto {
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
