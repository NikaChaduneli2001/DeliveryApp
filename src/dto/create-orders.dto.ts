import {
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { orderListInterface } from 'src/interface/orderList.interface';

export class createOrdersDto {
  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  orderList: orderListInterface[];
  @IsString()
  @IsOptional()
  deliveryAddress: string;
}
