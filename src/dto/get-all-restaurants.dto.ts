import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { RestaurantType } from 'src/enums/restaurant-type.enum';

enum SortDir {
  DESC = 'DESC',
  ASC = 'ASC',
}

export class searchBy {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsEnum(RestaurantType)
  type: RestaurantType;
  @IsOptional()
  @IsString()
  address: string;
  @IsOptional()
  @IsNumber()
  rating: number;
}

export class GetAllRestaurantsDto {
  @IsOptional()
  @IsString()
  sortBy?: string;
  @IsOptional()
  @IsEnum(SortDir)
  sortDir?: SortDir;
  @Type(() => searchBy)
  @IsOptional()
  searchBy?: searchBy;
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
