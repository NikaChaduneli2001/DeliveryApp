import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNumber,
  IsString,
} from 'class-validator';
import { Role } from 'src/enums/role.enum';

export class registerUserDto {
  @IsString()
  fullName: string;
  @IsNumber()
  phoneNumber: number;
  @IsString()
  address: string;
  @IsEmail()
  email: string;
  @IsString()
  password: string;
  @IsEnum(Role)
  role: Role;
}
