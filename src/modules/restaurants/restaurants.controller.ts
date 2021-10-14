import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CreateRestaurantDto } from 'src/dto/create-restaurant.dto';
import { GetAllRestaurantsDto } from 'src/dto/get-all-restaurants.dto';
import { UpdateRestaurantDto } from 'src/dto/update-restaurant.dto';
import { Role } from 'src/enums/role.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { RestaurantsService } from './restaurants.service';

@Controller('restaurants')
export class RestaurantsController {
  private readonly logger = new Logger(RestaurantsController.name);
  constructor(private readonly restaurantServise: RestaurantsService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async createRestaurant(@Body() data: CreateRestaurantDto) {
    try {
      const newrestaurant = await this.restaurantServise.createRestaurant(data);
      this.logger.log(`create restaurant ${newrestaurant}`);
      return getSuccessMessage(newrestaurant);
    } catch (err) {
      return getErrorMessage('Could Not Create restaurant!');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getrestaurant(@Param('id') id: number) {
    try {
      const res = await this.restaurantServise.getRestaurant(id);

      this.logger.log(`Get One restaurant By Id Number ${res}`);
      return getSuccessMessage(res);
    } catch (err) {
      return getErrorMessage('Could Not Find restaurant with this id!');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAllRestaurants(@Query() data: GetAllRestaurantsDto) {
    try {
      const restaurant = await this.restaurantServise.getAllRestaurants(data);

      this.logger.log(`Get All Restaurants ${restaurant}`);
      return getSuccessMessage(restaurant);
    } catch (err) {
      return getErrorMessage('Could Not Find Restaurants !');
    }
  }

  @Patch(':id')
  @Roles(Role.Operator)
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async updaterestaurant(
    @Param('id') id: number,
    @Body() data: UpdateRestaurantDto,
  ) {
    try {
      const result = await this.restaurantServise.updateRestaurant(id, data);
      this.logger.log(`Update restaurant ${result}`);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Could Not Update Information !');
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async deleterestaurant(@Param('id') id: number) {
    try {
      const result = await this.restaurantServise.deleteRestaurant(Number(id));
      this.logger.log(`Delete restaurant ${result}`);
      return getSuccessMessage(result);
    } catch (err) {
      return getErrorMessage('Could Not Delete restaurant !');
    }
  }
}
