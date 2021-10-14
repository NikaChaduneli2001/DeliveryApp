import { Module } from '@nestjs/common';
import { MenuMysqlModule } from 'src/repositories/menu/menu_mysql.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { MenuController } from './menu.controller';
import { MenuService } from './menu.service';

@Module({
  imports: [MenuMysqlModule,RestaurantsModule],
  controllers: [MenuController],
  providers: [MenuService],
  exports: [MenuService, MenuModule],
})
export class MenuModule {}
