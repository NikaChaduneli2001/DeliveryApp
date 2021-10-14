import { MenuEntity } from 'src/entities/menu.entity';

export interface orderListInterface {
  productId: number | MenuEntity;
  amount: number;
}
