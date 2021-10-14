import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createOrdersDto } from 'src/dto/create-orders.dto';
import { GetAllOrdersDto } from 'src/dto/get-all-orders.dto';
import { OrdersEntity } from 'src/entities/orders.entity';
import { orderStatus } from 'src/enums/order-status.enum';
import {
  createOrderInterface,
  OrdersInterface,
} from 'src/interface/order.interface';
import { Repository } from 'typeorm';

@Injectable()
export class OrdersRepository {
  private readonly logger = new Logger(this.constructor.name);
  constructor(
    @InjectRepository(OrdersEntity)
    private readonly OrdersRepository: Repository<OrdersEntity>,
  ) {}

  async createOrder(
    data: createOrdersDto,
    totalPrice: number,
    userId: number,
  ): Promise<OrdersInterface> {
    this.logger.log(`creating data : ${JSON.stringify(data)}`);
    this.logger.log(`creating totalPrice : ${JSON.stringify(totalPrice)}`);
    try {
      const newOrder = new OrdersEntity();
      newOrder.user = userId;
      newOrder.deliveryAddress = data.deliveryAddress;
      newOrder.orderList = JSON.stringify(data.orderList);
      newOrder.status = orderStatus.InProccessing;
      newOrder.totalPrice = totalPrice;
      newOrder.date = new Date();
      this.logger.log(`new order ${JSON.stringify(newOrder)}`);
      const result = await this.OrdersRepository.save(newOrder);
      this.logger.log(`Create Order RESULT  ${JSON.stringify(result)}`);
      if (!result) {
        return null;
      }
      return createOrderInterface(result);
    } catch (err) {
      this.logger.error(
        `Could not create Order, err :${JSON.stringify(err.message)}`,
      );
      return null;
    }
  }

  async getOneOrder(id: number): Promise<OrdersInterface> {
    const findOrder = await this.OrdersRepository.findOne({ id });
    if (!findOrder) {
      return null;
    }
    return createOrderInterface(findOrder);
  }

  async getAllOrders(query: GetAllOrdersDto): Promise<any> {
    this.logger.log(`get all orders query : ${JSON.stringify(query)}`);
    const queryBuilder = this.OrdersRepository.createQueryBuilder('order');
    queryBuilder.innerJoinAndSelect('order.user', 'user');
    if (query.limit) {
      const limit = Math.min(query.limit, 20);
      queryBuilder.limit(limit);
      this.logger.log(`query ${query}`);
      const page = query.page ? query.page - 1 : 0;
      queryBuilder.offset(page * limit);
    } else {
      queryBuilder.limit(20);
    }
    const result = await queryBuilder.getRawMany();
    this.logger.log(`all orders result  :${JSON.stringify(result)}`);
    if (result) {
      return result.map((ord) => ({
        id: ord.order_id,
        user: {
          id: ord.order_id,
          fullName: ord.user_fullName,
          address: ord.user_address,
          role: ord.user_role,
          phone: ord.user_phoneNumber,
          email: ord.user_email,
        },
        orderList: JSON.parse(ord.order_orderList),
        status: ord.order_status,
        date: ord.order_data,
        deliveryAddress: ord.order_deliveryAddress,
        totalPrice: ord.order_totalPrice,
        rateStatus: ord.ordr_rateStatus,
      }));
    } else {
      return null;
    }
  }

  async updateOrdersStatus(id: number, status: orderStatus): Promise<any> {
    const foundOrder = await this.OrdersRepository.findOne(id);
    this.logger.log(`all orders result  :${JSON.stringify(status)}`);

    if (!foundOrder) {
      return false;
    }

    const updateStats = await this.OrdersRepository.update(id, {
      status: status,
    });
    if (updateStats) {
      return {
        id,
        status,
      };
    } else {
      return null;
    }
  }

  async cancelOrder(id: number): Promise<OrdersInterface> {
    this.logger.log(`caneling orders id :${JSON.stringify(id)}`);
    const findOrder = await this.OrdersRepository.findOne({ id });
    this.logger.log(`find order : ${JSON.stringify(findOrder)}`);
    if (!findOrder) {
      this.logger.log(`orders not found`);
      return null;
    }
    return createOrderInterface(findOrder);
  }

  async updateOrder(
    id: number,
    data: OrdersInterface,
  ): Promise<OrdersInterface> {
    const findOrder = await this.OrdersRepository.findOne(id);
    if (!findOrder) {
      return null;
    }
    if (findOrder.status === orderStatus.InProccessing) {
      const update = await this.OrdersRepository.save({ id, ...data });
      if (!update) {
        return null;
      }
      return createOrderInterface(update);
    } else {
      return null;
    }
  }

  async orderBelongsToUser(orderId: number, userId: number) {
    const belongs = await this.OrdersRepository.createQueryBuilder()
      .where('id IN (:...ids)', { ids: orderId })
      .andWhere('userId=:userId', { userId })
      .getMany();
    if (belongs.length > 0) {
      return true;
    } else {
      return false;
    }
  }

  async makeOrderRated(orderId) {
    try {
      await this.OrdersRepository.update(orderId, {
        rateStatus: true,
      });
    } catch (error) {}
  }
}
