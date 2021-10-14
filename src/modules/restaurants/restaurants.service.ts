import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from 'src/dto/create-restaurant.dto';
import { GetAllRestaurantsDto } from 'src/dto/get-all-restaurants.dto';
import { UpdateRestaurantDto } from 'src/dto/update-restaurant.dto';
import { createRestaurantInterface } from 'src/interface/restaurant.interface';
import { RestaurantsRepository } from 'src/repositories/restaurants/restaurants_mysql.repository';

@Injectable()
export class RestaurantsService {
  constructor(private readonly restaurantRepository: RestaurantsRepository) {}

  async createRestaurant(data: CreateRestaurantDto) {
    return await this.restaurantRepository.createRestaurant(data);
  }

  async getRestaurant(id: number) {
    const res = await this.restaurantRepository.getRestaurant(id);

    return createRestaurantInterface(res);
  }

  async getAllRestaurants(data: GetAllRestaurantsDto) {
    const res = await this.restaurantRepository.getAllRestaurants(data);
    const restaurants = res.map((restaurant) =>
      createRestaurantInterface(restaurant),
    );
    return restaurants;
  }

  async updateRestaurant(id: number, data: UpdateRestaurantDto) {
    // here will be check for userId and company owner
    const restaurant = await this.restaurantRepository.updateRestaurant(
      id,
      data,
    );

    return createRestaurantInterface(restaurant);
  }

  async deleteRestaurant(id: number) {
    return await this.restaurantRepository.deleteRestaurant(id);
  }
}
