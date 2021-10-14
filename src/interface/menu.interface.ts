import { RestaurantEntity } from 'src/entities/restaurant.entity';
import { MenuType } from 'src/enums/menu-type.enum';

export interface MenuInterface {
  id?: number;
  restaurant?: number | RestaurantEntity;
  itemName: string;
  type: MenuType;
  description: string;
  sumbnail: string;
  price: number;
  isDeleted?: boolean;
}

export function createMenuInterface(menu) {
  return {
    id: menu.id,
    itemName: menu.itemName,
    restaurant: menu.restaurant,
    description: menu.description,
    sumbnail: menu.sumbnail,
    type: menu.type,
    price: menu.price,
  };
}
