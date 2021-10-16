import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createMenuDto } from 'src/dto/create-menu.dto';
import { getAllMenuDto } from 'src/dto/get-all-menu.dto';
import { updateMenuDto } from 'src/dto/update-menu.dto';
import { MenuEntity } from 'src/entities/menu.entity';
import {
  createMenuInterface,
  MenuInterface,
} from 'src/interface/menu.interface';
import { Repository } from 'typeorm';

@Injectable()
export class MenuMysqlService {
  private readonly logger = new Logger(MenuMysqlService.name);
  constructor(
    @InjectRepository(MenuEntity)
    private readonly MenuRepository: Repository<MenuEntity>,
  ) {}

  async createMenu(data: createMenuDto): Promise<MenuInterface> {
    this.logger.log(`create menus data : ${JSON.stringify(data)}`);
    const newMenu = new MenuEntity();
    newMenu.itemName = data.itemName;
    newMenu.description = data.description;
    newMenu.restaurant = data.restaurantId;
    newMenu.type = data.type;
    newMenu.sumbnail = data.sumbnail;
    newMenu.price = data.price;
    newMenu.isDeleted = false;
    const menu = await this.MenuRepository.save(newMenu);
    this.logger.log(`created menu ${JSON.stringify(menu)}`);
    if (!menu) {
      this.logger.error(`could not created menu ${JSON.stringify(menu)}`);
      return null;
    }
    return createMenuInterface(menu);
  }

  async menuBelongsToRestaurant(menuId: number[], restaurantId: number) {
    this.logger.log(
      `menu belongs to restaurant , menuId:${JSON.stringify(
        menuId,
      )}, restaurantId:${JSON.stringify(restaurantId)}`,
    );
    const belongs = await this.MenuRepository.createQueryBuilder()
      .where('isDeleted = false')
      .andWhere('id IN (:...ids)', { ids: menuId })
      .andWhere('restaurantId=:restaurantId', { restaurantId })
      .getMany();
    this.logger.log(`belongs to ${JSON.stringify(belongs)}`);
    if (belongs.length > 0) {
      this.logger.log(`Menu belongs to restaurant`);
      return true;
    } else {
      return false;
    }
  }

  async updateMenu(id: number, data: updateMenuDto): Promise<MenuInterface> {
    this.logger.log(
      `updating menu id: ${JSON.stringify(id)} data : ${JSON.stringify(data)}`,
    );
    const update = await this.MenuRepository.save({ id, data });
    this.logger.log(`updated menu : ${JSON.stringify(update)}`);
    if (!update) {
      this.logger.error(`The menu has not been updated`);
      return null;
    }
    const findUpdatedMenu = await this.MenuRepository.findOne({ id });
    this.logger.log(`find menu : ${JSON.stringify(findUpdatedMenu)}`);
    if (!findUpdatedMenu) {
      this.logger.error(`the menu has not been found`);
      return null;
    }
    return createMenuInterface(findUpdatedMenu);
  }

  async deleteMenu(id: number): Promise<MenuInterface> {
    this.logger.log(`delete menu id :${JSON.stringify(id)}`);
    const deleteMenu = await this.MenuRepository.save({ id, isDeleted: true });
    this.logger.log(`deleted menu :${JSON.stringify(deleteMenu)}`);
    if (!deleteMenu) {
      this.logger.error(`deleted menu not found`);
      return null;
    }
    const findDeletedMenu = await this.MenuRepository.findOne({ id });
    this.logger.log(`find deleted menu :${JSON.stringify(findDeletedMenu)}`);
    if (findDeletedMenu) {
      return createMenuInterface(findDeletedMenu);
    } else {
      this.logger.error(`not found deleted menu`);
      return null;
    }
  }

  async getAllMenu(data: getAllMenuDto): Promise<any> {
    this.logger.log(`get all menu's data :${JSON.stringify(data)}`);
    const query = await this.MenuRepository.createQueryBuilder('menu');
    query.innerJoinAndSelect('menu.restaurant', 'restaurant');
    query.innerJoinAndSelect('restaurant.user', 'user');
    query.where('menu.isDeleted = false');
    if (data.searchBy) {
      if (data.searchBy.itemName) {
        query.andWhere('itemName like :dishesName', {
          dishesName: `%${this.escapeLikeString(data.searchBy.itemName)}%`,
        });
      } else if (data.searchBy.type) {
        query.andWhere('type like :MenuType', {
          MenuType: `%${data.searchBy.type}%`,
        });
      }
    }

    if (data.sortBy) {
      query.orderBy(data.sortBy, data.sortDir);
    }
    let limit = 0;
    if (data.limit) {
      Math.min(data.limit, 25);
    }
    query.limit(data.limit);
    if (data.page) {
      const page = data.page - 1;
      query.offset(page * limit);
    }
    const result = await query.getRawMany();
    this.logger.log(`find all menu:${JSON.stringify(result)}`);
    if (result) {
      return result.map((men) => ({
        id: men.menu_id,
        restaurant: {
          id: men.menu_id,
          user: {
            id: men.user_id,
            fullName: men.user_fullName,
            role: men.user_role,
            phone: men.user_phone,
            address: men.user_address,
          },
          address: men.restaurant_address,
          name: men.restaurant_name,
          type: men.restaurant_type,
          rating: men.restaurant_rating,
        },
        itemName: men.menu_itemName,
        description: men.menu_description,
        type: men.menu_type,
        price: men.menu_price,
        sumbnail: men.menu_sumbnail,
      }));
    } else {
      this.logger.error(
        `menu not found with given params:${JSON.stringify(data)}`,
      );
      return null;
    }
  }
  escapeLikeString(raw: string): string {
    return raw.replace(/[\\%_]/g, '\\$&');
  }

  async getOneMenu(id: number): Promise<MenuInterface> {
    const menu = await this.MenuRepository.findOne({ id });
    if (!menu) {
      return null;
    }
    return createMenuInterface(menu);
  }

  async getPrice(id: number[]) {
    this.logger.log(`get price ids :${JSON.stringify(id)}`);
    const query = await this.MenuRepository.createQueryBuilder('price')
      .where('price.id IN (:...ids)', { ids: id })
      .andWhere('price.isDeleted=false');
    const result = await query.getMany();
    this.logger.log(`result : ${JSON.stringify(result)}`);
    if (result) {
      return result.map((menu) => ({
        id: menu.id,
        price: menu.price,
      }));
    } else {
      return false;
    }
  }

  async globalSearch(data: string) {
    this.logger.log(`search : ${JSON.stringify(data)}`);
    const query = await this.MenuRepository.createQueryBuilder('menu');
    query.innerJoinAndSelect('menu.restaurant', 'restaurant');
    if (data) {
      query
        .where('menu.itemName like :searchBy', {
          searchBy: `%${this.escapeLikeString(data)}%`,
        })
        .orWhere('restaurant.name like :searchBy', {
          searchBy: `%${this.escapeLikeString(data)}%`,
        })
        .orderBy('restaurant.id');

      const result = await query.getRawMany();
      this.logger.log(`result : ${JSON.stringify(result)}`);

      if (result) {
        return result.map((men) => ({
          id: men.menu_id,
          restaurant: {
            id: men.menu_id,
            address: men.restaurant_address,
            name: men.restaurant_name,
            type: men.restaurant_type,
            rating: men.restaurant_rating,
          },
          itemName: men.menu_itemName,
          description: men.menu_description,
          type: men.menu_type,
          price: men.menu_price,
          sumbnail: men.menu_sumbnail,
        }));
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
}
