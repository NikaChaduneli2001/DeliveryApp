import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AddressEntity } from 'src/entities/address.entity';
import { AddressMysqlService } from './address_mysql.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity])],
  providers: [AddressMysqlService],
  exports: [AddressMysqlService, AddressMysqlModule],
})
export class AddressMysqlModule {}
