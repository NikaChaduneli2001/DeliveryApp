import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRestaurantDto } from 'src/dto/create-restaurant.dto';
import { GetAllRestaurantsDto } from 'src/dto/get-all-restaurants.dto';
import { UpdateRestaurantDto } from 'src/dto/update-restaurant.dto';
import { RestaurantEntity } from 'src/entities/restaurant.entity';
import { Stars } from 'src/enums/stars.enum';
import {
  createRestaurantInterface,
  Restaurant,
} from 'src/interface/restaurant.interface';
import { escapeLikeString } from 'src/utils/escape-like-string.function';
import { Repository } from 'typeorm';

@Injectable()
export class RestaurantsRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(RestaurantEntity)
    private readonly RestaurantRepository: Repository<RestaurantEntity>,
  ) {}

  async createRestaurant(data: CreateRestaurantDto): Promise<Restaurant> {
    try {
      const newRestaurant = new RestaurantEntity();
      newRestaurant.user = data.userId;
      newRestaurant.name = data.name;
      newRestaurant.address = data.address;
      newRestaurant.type = data.type;

      await this.RestaurantRepository.save(newRestaurant);
      this.logger.log(`Create Restaurant ${newRestaurant}`);
      delete newRestaurant.isDeleted;
      return newRestaurant;
    } catch (err) {
      this.logger.log(`Could Not Create Restaurant: ${err.message}`);
      return null;
    }
  }

  async getRestaurant(id: number): Promise<Restaurant> {
    try {
      const res = await this.RestaurantRepository.findOne(id);
      this.logger.log(`Get Restaurant By Id Number ${res}`);

      return res;
    } catch (err) {
      this.logger.log(`Could Not get Restaurant By Id Number`);
      return null;
    }
  }

  async getAllRestaurants(query: GetAllRestaurantsDto): Promise<Restaurant[]> {
    const queryBuilder = this.RestaurantRepository.createQueryBuilder();
    queryBuilder.where('isDeleted = false');
    if (query.limit) {
      const limit = Math.min(query.limit, 20);
      queryBuilder.limit(limit);
      this.logger.log(`query ${query}`);
      const page = query.page ? query.page - 1 : 0;
      queryBuilder.offset(page * limit);
    } else {
      queryBuilder.limit(20);
    }

    if (query.searchBy) {
      if (query.searchBy.name) {
        queryBuilder.andWhere('name like :restaurantName', {
          restaurantName: `%${escapeLikeString(query.searchBy.name)}%`,
        });
      } else if (query.searchBy.address) {
        queryBuilder.andWhere('address like :restaurantAddress', {
          restaurantAddress: `%${query.searchBy.address}%`,
        });
      } else if (query.searchBy.type) {
        queryBuilder.andWhere('type like :restaurantType', {
          restaurantType: `%${escapeLikeString(query.searchBy.type)}%`,
        });
      }
    }
    const res = await queryBuilder.getMany();
    return res;
  }

  async updateRestaurant(
    id: number,
    data: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    try {
      await this.RestaurantRepository.update(id, data);
      const result = await this.RestaurantRepository.findOne(id);
      this.logger.log(`Restaurant was Updated ${result}`);

      return result;
    } catch (err) {
      this.logger.log(`Restaurant Could NOt update!`);
      return null;
    }
  }

  async deleteRestaurant(id: number): Promise<String> {
    try {
      await this.RestaurantRepository.save({
        id,
        isDeleted: true,
      });
      this.logger.log(`Restaurant was Deleted`);
      return 'Restaurant was Deleted!';
    } catch (err) {
      this.logger.log(`Could NoT delete Restaurant`);
      return null;
    }
  }

  async updateRestaurantRating(
    id: number,
    newrating: number,
    newReviewCount: number,
  ) {
    try {
      await this.RestaurantRepository.save({
        id,

        ...{ rating: newrating, reviewCount: newReviewCount },
      });
    } catch (error) {}
  }
}
