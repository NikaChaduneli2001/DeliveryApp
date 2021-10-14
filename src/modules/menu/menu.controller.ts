import {
  Delete,
  Param,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Get } from '@nestjs/common';
import { Patch } from '@nestjs/common';
import { Body, Controller, Logger, Post } from '@nestjs/common';
import { createMenuDto } from 'src/dto/create-menu.dto';
import { getAllMenuDto } from 'src/dto/get-all-menu.dto';
import { updateMenuDto } from 'src/dto/update-menu.dto';
import { Role } from 'src/enums/role.enum';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { MenuService } from './menu.service';

@Controller('menu')
export class MenuController {
  private readonly logger = new Logger(MenuController.name);
  constructor(private readonly menuService: MenuService) {}

  @Post()
  @Roles(Role.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async createMenu(@Body() data: createMenuDto) {
    this.logger.log(`create menu body: ${JSON.stringify(data)}`);
    try {
      const menu = await this.menuService.createMenu(data);
      this.logger.log(`create menu: ${JSON.stringify(menu)}`);
      if (!menu) {
        this.logger.error(`could not created menu`);
        return getErrorMessage('could not created menu');
      }
      return getSuccessMessage(menu);
    } catch (err) {
      this.logger.error(
        `could not create menu with given params data : ${JSON.stringify(
          data,
        )} err:${JSON.stringify(err)}`,
      );
      return getErrorMessage('could not create menu with given params');
    }
  }
  @Patch(':id')
  @Roles(Role.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async updateMenu(@Req() req, @Body() data: updateMenuDto) {
    this.logger.log(`updateing menu reques : ${JSON.stringify(req)}`);
    try {
      const { res } = req;
      const belongsToRestaurant =
        await this.menuService.menuBelongsToRestaurant(
          res.menuId,
          res.restaurantId,
        );
      this.logger.log(
        `Menu belongs to Restaruants : ${JSON.stringify(belongsToRestaurant)}`,
      );
      if (!belongsToRestaurant) {
        this.logger.error(
          `Menu not belongs to Restaruants : ${JSON.stringify(
            belongsToRestaurant,
          )}`,
        );
        return getErrorMessage('Menu not belongs to Restaurant');
      }
      const updated = await this.menuService.updateMenu(req.menuId, data);
      this.logger.log(`updated Menu : ${JSON.stringify(updated)}`);
      if (!updated) {
        this.logger.error(`could not updated menu`);
        return getErrorMessage('Menu not updated');
      }
      return getSuccessMessage(updated);
    } catch (err) {
      this.logger.error(
        `could not updated menu with given params , req :${JSON.stringify(
          req,
        )}, err : ${JSON.stringify(err)}`,
      );
      return getErrorMessage('could not updated menu');
    }
  }

  @Delete(':id')
  @Roles(Role.Operator)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async deleteMenu(@Req() req) {
    this.logger.log(`deleting menu reques : ${JSON.stringify(req)}`);
    try {
      const { res } = req;
      const belongs = await this.menuService.menuBelongsToRestaurant(
        res.menuId,
        res.restaurantId,
      );
      this.logger.log(`menu belongs to resuarant : ${JSON.stringify(belongs)}`);
      if (!belongs) {
        this.logger.error(`menu not belongs to restaurant`);
        return getErrorMessage('Menu not belongs to restaurant');
      }
      const deletedMenu = await this.menuService.deleteMenu(req.menuId);
      this.logger.log(`deleted menu : ${JSON.stringify(deletedMenu)}`);
      if (!deletedMenu) {
        this.logger.error(`Menu not deleted`);
        return getErrorMessage('Menu not deleted');
      }
      return getSuccessMessage(deletedMenu);
    } catch (err) {
      this.logger.error(
        `could not deleted menu with given pramas , req : ${JSON.stringify(
          req,
        )} , error :${JSON.stringify(err)}`,
      );
      return getErrorMessage('could not deleted menu with given params');
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getAllMenu(@Query() data: getAllMenuDto) {
    this.logger.log(`get all menu's data : ${JSON.stringify(data)}`);
    try {
      const allMenu = await this.menuService.getAllMenu(data);
      this.logger.log(`all menu: ${JSON.stringify(allMenu)}'`);
      if (!allMenu) {
        this.logger.error(`could not find all menu with given params`);
        return getErrorMessage('Could not get all menu');
      }
      return getSuccessMessage(allMenu);
    } catch (err) {
      this.logger.error(
        `could not find all menu with given params, err : ${JSON.stringify(
          err,
        )}`,
      );
      return getErrorMessage('Could not get all menu with given params');
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async getOneMenu(@Param('id') id: number) {
    this.logger.log(`get One Menu's id :${JSON.stringify(id)}`);
    try {
      const menu = await this.menuService.getOneMenu(id);
      this.logger.log(`find menu with id : ${JSON.stringify(menu)}`);
      if (!menu) {
        this.logger.error(`could not found menu`);
        return getErrorMessage('Could not find menu with given id');
      }
      return getSuccessMessage(menu);
    } catch (err) {
      this.logger.error(
        `could not found menu with given id :${JSON.stringify(
          id,
        )}, err ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not find menu with given id');
    }
  }
  @Get('/search/:search')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UsePipes(ValidationPipe)
  async globalSearch(@Param('search') data: string) {
    this.logger.log(`data : ${JSON.stringify(data)}`);
    try {
      const global = await this.menuService.globalSearch(data);
      if (!global) {
        return getErrorMessage('Could not find items');
      }
      return getSuccessMessage(global);
    } catch {
      return getErrorMessage('Could not find items with given params');
    }
  }
}
