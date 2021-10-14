import { Injectable } from '@nestjs/common';
import { createMenuDto } from 'src/dto/create-menu.dto';
import { getAllMenuDto } from 'src/dto/get-all-menu.dto';
import { updateMenuDto } from 'src/dto/update-menu.dto';
import { MenuMysqlService } from 'src/repositories/menu/menu_mysql.repository';

@Injectable()
export class MenuService {
  constructor(private readonly menuRepo: MenuMysqlService) {}

  async createMenu(data: createMenuDto) {
    try {
      const createMenu = await this.menuRepo.createMenu(data);
      if (!createMenu) {
        return false;
      } else {
        return createMenu;
      }
    } catch {
      return null;
    }
  }

  async menuBelongsToRestaurant(menuId: number[], restaurantId: number) {
    try {
      const belongsToRestaurant = await this.menuRepo.menuBelongsToRestaurant(
        menuId,
        restaurantId,
      );
      if (!belongsToRestaurant) {
        return false;
      }
      return belongsToRestaurant;
    } catch {
      return null;
    }
  }

  async updateMenu(id: number, data: updateMenuDto) {
    try {
      const updatedMenu = await this.menuRepo.updateMenu(id, data);
      if (!updatedMenu) {
        return false;
      }
      return updatedMenu;
    } catch {
      return null;
    }
  }

  async deleteMenu(id: number) {
    try {
      const deletedMenu = await this.menuRepo.deleteMenu(id);
      if (!deletedMenu) {
        return false;
      }
      return deletedMenu;
    } catch {
      return null;
    }
  }

  async getAllMenu(data: getAllMenuDto) {
    try {
      const getAllMenu = await this.menuRepo.getAllMenu(data);
      if (!getAllMenu) {
        return false;
      }
      return getAllMenu;
    } catch {
      return null;
    }
  }

  async getOneMenu(id: number) {
    try {
      const menu = await this.menuRepo.getOneMenu(id);
      if (!menu) {
        return false;
      }
      return menu;
    } catch {
      return null;
    }
  }

  async globalSearch(data: string) {
    try {
      const global = await this.menuRepo.globalSearch(data);
      if (!global) {
        return false;
      }
      return global;
    } catch {
      return null;
    }
  }
}
