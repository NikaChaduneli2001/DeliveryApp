import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuEntity } from 'src/entities/menu.entity';
import { MenuMysqlService } from './menu_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MenuEntity])],
  providers: [MenuMysqlService],
  exports: [MenuMysqlService,MenuMysqlModule],
})
export class MenuMysqlModule {}
