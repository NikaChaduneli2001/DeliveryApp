import { Logger, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantEntity } from 'src/entities/restaurant.entity';
import { RestaurantsRepository } from './restaurants_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantEntity])],

  providers: [RestaurantsRepository],
  exports: [RestaurantsRepository, RestaurantsMysqlModule],
})
export class RestaurantsMysqlModule {}
