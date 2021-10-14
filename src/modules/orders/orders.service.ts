import { Injectable, Logger } from '@nestjs/common';
import { createAddressDto } from 'src/dto/create-address.dto';
import { createOrdersDto } from 'src/dto/create-orders.dto';
import { GetAllOrdersDto } from 'src/dto/get-all-orders.dto';
import { MakeReviewDTO } from 'src/dto/make-review.dto';
import { orderStatus } from 'src/enums/order-status.enum';
import { OrdersInterface } from 'src/interface/order.interface';
import { AddressMysqlService } from 'src/repositories/address/address_mysql.repository';
import { MenuMysqlService } from 'src/repositories/menu/menu_mysql.repository';
import { OrdersRepository } from 'src/repositories/orders/orders_mysql.repository';
import { RestaurantsRepository } from 'src/repositories/restaurants/restaurants_mysql.repository';
import { ReviewMysqlRepo } from 'src/repositories/review/review-mysql.repository';
import { UsersMysqlService } from 'src/repositories/users/users_mysql.repository';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  constructor(
    private readonly OrdersRepo: OrdersRepository,
    private readonly RestaurantsRepo: RestaurantsRepository,
    private readonly MenuRepo: MenuMysqlService,
    private readonly ReviewRepo: ReviewMysqlRepo,
    private readonly addressRepo: AddressMysqlService,
    private readonly UsersRepo: UsersMysqlService,
  ) {}

  async createOrder(
    data: createOrdersDto,
    restaurantId: number,
    userId: number,
  ) {
    this.logger.log(`creating order data :${JSON.stringify(data)}`);
    try {
      const arr = [];
      let price = 0;
      for (let i = 0; i < data.orderList.length; i += 1) {
        arr.push(data.orderList[i].productId);
      }
      const belongs = await this.MenuRepo.menuBelongsToRestaurant(
        arr,
        restaurantId,
      );
      if (!belongs) {
        this.logger.error(`Menu not Belongs To Restaurant`);
        throw new Error();
      }
      const productsId = await this.MenuRepo.getPrice(arr);
      this.logger.log(`productsId : ${JSON.stringify(productsId)}`);
      if (!productsId) {
        return false;
      }
      for (let j = 0; j < productsId.length; j += 1) {
        price += productsId[j].price * data.orderList[j].amount;
      }
      if (!data.deliveryAddress) {
        const foundUser = await this.UsersRepo.getOneUser(userId);
        if (!foundUser) {
          return false;
        }
        data.deliveryAddress = foundUser.address;
      }
      const order = await this.OrdersRepo.createOrder(data, price, userId);
      this.logger.log(`created order ${JSON.stringify(order)}`);
      const addressObject: createAddressDto = {
        user: userId,
        streetAddress: data.deliveryAddress,
      };
      const check = await this.addressRepo.checkAddress(data.deliveryAddress);
      this.logger.log(`check : ${JSON.stringify(check)}`);
      if (check) {
        await this.addressRepo.createAddress(addressObject);
      }

      return order;
    } catch {
      return null;
    }
  }

  async getOneOrder(id: number) {
    try {
      const foundUser = await this.OrdersRepo.getOneOrder(id);
      if (!foundUser) {
        return false;
      }
      return foundUser;
    } catch {
      return null;
    }
  }

  async getAllOrders(data: GetAllOrdersDto) {
    try {
      const foundOrder = await this.OrdersRepo.getAllOrders(data);
      if (!foundOrder) {
        return false;
      }
      return foundOrder;
    } catch {
      return null;
    }
  }

  async updateOrdersStatus(id: number, status: orderStatus) {
    try {
      const updateStatus = await this.OrdersRepo.updateOrdersStatus(id, status);
      if (!updateStatus) {
        return false;
      }
      return updateStatus;
    } catch {
      return null;
    }
  }

  async cancelOrder(id: number) {
    this.logger.log(`caneling order id :${JSON.stringify(id)}`);
    try {
      const cancel = await this.OrdersRepo.cancelOrder(id);
      this.logger.log(`canel order id :${JSON.stringify(cancel)}`);
      if (!cancel) {
        return false;
      }
      if (cancel.status === orderStatus.Canceled) {
        return cancel;
      }
    } catch {
      return null;
    }
  }

  async updateOrder(id: number, data: OrdersInterface) {
    try {
      const update = await this.OrdersRepo.updateOrder(id, data);
      if (!update) {
        return false;
      }
      return update;
    } catch {
      return null;
    }
  }
  async orderBelongsToUser(orderId: number, userId: number) {
    try {
      const belongsToUser = await this.OrdersRepo.orderBelongsToUser(
        orderId,
        userId,
      );
      if (!belongsToUser) {
        return false;
      }
      return belongsToUser;
    } catch {
      return null;
    }
  }

  async reviewOrder(data: MakeReviewDTO, userId: number) {
    try {
      const order = await this.OrdersRepo.getOneOrder(data.orderId);
      if (order.rateStatus === true || order.status != orderStatus.Delivered) {
        throw new Error('status is not Delievered or rateStatus is true');
      }
      const itemId = order.orderList.slice(
        14,
        order.orderList.indexOf(',"amount"'),
      );
      this.logger.log(`item id :${JSON.stringify(itemId)}`);
      const menuInfo = await this.MenuRepo.getOneMenu(Number(itemId));
      this.logger.log(`menuInfo  :${JSON.stringify(menuInfo)}`);
      if (!menuInfo) {
        return false;
      }
      const info = menuInfo.restaurant['id'];
      this.logger.log(`info restairant :${JSON.stringify(info)}`);
      if (info != data.restaurantId) {
        throw new Error('restaurant is incorrect');
      }

      this.logger.log(
        `update status : ${JSON.stringify({ userId })}`,
        `update status : ${JSON.stringify(order.user['id'])}`,
      );
      if (order.user['id'] !== userId) {
        throw new Error(' id is incorrect');
      }
      const newReview = await this.ReviewRepo.makeReview(data, userId);
      const restaurant = await this.RestaurantsRepo.getRestaurant(
        data.restaurantId,
      );
      this.logger.log(`restaurant info : ${JSON.stringify({ restaurant })}`);

      const newRating =
        (Number(restaurant.reviewCount) * Number(restaurant.rating) +
          Number(data.stars)) /
        (Number(restaurant.reviewCount) + 1);

      await this.OrdersRepo.makeOrderRated(data.orderId);
      await this.RestaurantsRepo.updateRestaurantRating(
        data.restaurantId,
        newRating,
        restaurant.reviewCount + 1,
      );
      return newReview;
    } catch (error) {
      return error.message;
    }
  }
}
