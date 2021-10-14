import { Param, Put, UseGuards } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Req } from '@nestjs/common';
import { Delete } from '@nestjs/common';
import { Get, Query } from '@nestjs/common';
import {
  Body,
  Controller,
  Logger,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { createOrdersDto } from 'src/dto/create-orders.dto';
import { GetAllOrdersDto } from 'src/dto/get-all-orders.dto';
import { MakeReviewDTO } from 'src/dto/make-review.dto';
import { orderStatus } from 'src/enums/order-status.enum';
import { Role } from 'src/enums/role.enum';
import { OrdersInterface } from 'src/interface/order.interface';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  private readonly logger = new Logger(OrdersController.name);
  constructor(private readonly ordersService: OrdersService) {}
  @Post(':restaurantId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async createOrder(
    @Body() data: createOrdersDto,
    @Param('restaurantId') restaurantId: number,
    @Req() req,
  ) {
    this.logger.log(`creating order data :${JSON.stringify(data)}`);
    try {
      const { user } = req;
      const createOrder = await this.ordersService.createOrder(
        data,
        restaurantId,
        user.userId,
      );
      this.logger.log(`created order data :${JSON.stringify(createOrder)}`);
      if (!createOrder) {
        this.logger.error(`could not created order
          `);
        return getErrorMessage('could not created order');
      }
      return getSuccessMessage(createOrder);
    } catch {
      return getErrorMessage('could not create order with given params');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getOneOrder(@Param('id') id: number, @Req() req) {
    try {
      const { user } = req;
      const belongs = await this.ordersService.orderBelongsToUser(
        id,
        user.userId,
      );
      if (!belongs) {
        return getErrorMessage('Order not belongs to User');
      }
      const order = await this.ordersService.getOneOrder(id);
      if (!order) {
        return getErrorMessage('could not found Order');
      }
      return getSuccessMessage(order);
    } catch {
      return getErrorMessage('could not found Order with given params');
    }
  }

  @Get()
  // @Roles(Role.Operator)
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAllOrder(@Query() data: GetAllOrdersDto) {
    this.logger.log(`get all orders data :${JSON.stringify(data)}`);
    try {
      const orders = await this.ordersService.getAllOrders(data);
      this.logger.log(`all orders : ${JSON.stringify(orders)}`);
      if (!orders) {
        this.logger.error(`could not get all orders`);
        return getErrorMessage('could not get all orders');
      }
      return getSuccessMessage(orders);
    } catch (err) {
      this.logger.error(
        `could not get all orders with given  params , error: ${JSON.stringify(
          err.message,
        )}`,
      );
      return getErrorMessage('could not get all orders with given params');
    }
  }

  @Put(':id')
  @Roles(Role.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async updateStatus(
    @Param('id') id: number,
    @Body('status') status: orderStatus,
  ) {
    this.logger.log(
      `updating status id : ${JSON.stringify(id)} , status : ${JSON.stringify(
        status,
      )}`,
    );

    try {
      const update = await this.ordersService.updateOrdersStatus(id, status);
      this.logger.log(` update status : ${JSON.stringify(update)}`);

      if (!update) {
        this.logger.error(
          `could not update status : ${JSON.stringify(status)}`,
        );

        return getErrorMessage('could not update status');
      }

      return getSuccessMessage(update);
    } catch (err) {
      this.logger.error(
        `could not updated status with given params error: ${JSON.stringify(
          err,
        )}`,
      );
      return getErrorMessage('could not update status with given params');
    }
  }
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async canelOrder(@Param('id') id: number, @Req() req) {
    try {
      const { user } = req;
      const belongs = await this.ordersService.orderBelongsToUser(
        id,
        user.userId,
      );
      if (!belongs) {
        return getErrorMessage('Order not belongs to user');
      }
      const cancel = await this.ordersService.cancelOrder(id);
      if (!cancel) {
        return getErrorMessage('could not caneled order ');
      }
      return getSuccessMessage(cancel);
    } catch {
      return getErrorMessage('could not caneled order with given params');
    }
  }

  @Patch(':id')
  @Roles(Role.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async updateOrder(
    @Param('id') id: number,
    @Body() order: OrdersInterface,
    @Req() req,
  ) {
    try {
      const { user } = req;
      const belongs = await this.ordersService.orderBelongsToUser(
        id,
        user.userId,
      );
      if (!belongs) {
        return getErrorMessage('Order not belongs to user');
      }
      const update = await this.ordersService.updateOrder(id, order);
      if (!update) {
        return getErrorMessage('could not update order ');
      }
      return getSuccessMessage(update);
    } catch {
      return getErrorMessage('could not update order with given params');
    }
  }

  @Post('/review/stars')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async makeReview(@Body() data: MakeReviewDTO, @Req() req) {
    try {
      const { user } = req;
      this.logger.log(` update status : ${JSON.stringify(user)}`);
      const newReview = await this.ordersService.reviewOrder(data, user.userId);
      return getSuccessMessage(newReview);
    } catch (error) {
      return getErrorMessage("Couldn't make review");
    }
  }
}
