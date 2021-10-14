import { Module } from '@nestjs/common';
import { AddressMysqlModule } from 'src/repositories/address/address_mysql.module';
import { AddressController } from './address.controller';
import { AddressService } from './address.service';

@Module({
  imports: [AddressMysqlModule],
  exports: [AddressService],

  controllers: [AddressController],
  providers: [AddressService, AddressModule],
})
export class AddressModule {}
