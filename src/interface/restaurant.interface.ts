import { RestaurantType } from 'src/enums/restaurant-type.enum';
import { UsersInterface } from './users-interface';

export interface Restaurant {
  id?: number;
  user?: number | UsersInterface;
  address: string;
  name: string;
  type: RestaurantType;
  rating: number;
  isDeleted?: boolean;
  reviewCount: number;
}
export function createRestaurantInterface(data): Restaurant {
  const restaurant = {
    id: data.id,
    name: data.name,
    address: data.address,
    type: data.type,
    rating: data.rating,
    reviewCount: data.reviewCount,
  };
  return restaurant;
}
