import { UsersEntity } from 'src/entities/users.entity';
import { orderStatus } from 'src/enums/order-status.enum';
import { orderListInterface } from './orderList.interface';

export interface OrdersInterface {
  id?: number;
  user: number | UsersEntity;
  orderList: string;
  deliveryAddress: string;
  date: Date;
  status: orderStatus;
  totalPrice?: number;
  rateStatus: boolean;
}

export function createOrderInterface(result) {
  return {
    id: result.id,
    user: result.user,
    orderList: JSON.parse(result.orderList),
    status: result.status,
    date: result.date,
    deliveryAddress: result.deliveryAddress,
    totalPrice: result.totalPrice,
    rateStatus: result.rateStatus,
  };
}
