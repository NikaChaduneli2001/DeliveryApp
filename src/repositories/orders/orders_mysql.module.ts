import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrdersEntity } from 'src/entities/orders.entity';
import { OrdersRepository } from './orders_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrdersEntity])],

  providers: [OrdersRepository],
  exports: [OrdersRepository],
})
export class OrdersMysqlModule {}
