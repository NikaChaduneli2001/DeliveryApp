import { Module } from '@nestjs/common';
import { AddressMysqlModule } from 'src/repositories/address/address_mysql.module';
import { MenuMysqlModule } from 'src/repositories/menu/menu_mysql.module';
import { OrdersMysqlModule } from 'src/repositories/orders/orders_mysql.module';
import { RestaurantsMysqlModule } from 'src/repositories/restaurants/restaurants_mysql.module';
import { ReviewMysqlModule } from 'src/repositories/review/review-mysql.module';
import { UsersMysqlModule } from 'src/repositories/users/users_mysql.module';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    OrdersMysqlModule,
    MenuMysqlModule,
    ReviewMysqlModule,
    RestaurantsMysqlModule,
    AddressMysqlModule,
    UsersMysqlModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService, OrdersModule],
})
export class OrdersModule {}
