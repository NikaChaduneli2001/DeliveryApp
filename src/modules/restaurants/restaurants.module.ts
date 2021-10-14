import { Module } from '@nestjs/common';
import { RestaurantsMysqlModule } from 'src/repositories/restaurants/restaurants_mysql.module';
import { RestaurantsRepository } from 'src/repositories/restaurants/restaurants_mysql.repository';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantsService } from './restaurants.service';

@Module({
  imports: [RestaurantsMysqlModule],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService, RestaurantsModule],
})
export class RestaurantsModule {}
