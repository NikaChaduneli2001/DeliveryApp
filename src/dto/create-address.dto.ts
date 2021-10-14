import {
  IsInt,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class createAddressDto {
  @IsNumber()
  @IsInt()
  user: number;
  @IsString()
  @MaxLength(100)
  @MinLength(3)
  streetAddress: string;
}
