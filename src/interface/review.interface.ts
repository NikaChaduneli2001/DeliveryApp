import { OrdersEntity } from 'src/entities/orders.entity';
import { UsersEntity } from 'src/entities/users.entity';

export interface ReviewInterface {
  id?: number;
  comment?: string;
  stars?: number;
  order: number | OrdersEntity;
  user: number | UsersEntity;
}
