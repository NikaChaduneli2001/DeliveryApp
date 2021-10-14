import { Injectable, Logger } from '@nestjs/common';
import { createAddressDto } from 'src/dto/create-address.dto';

import { AddressMysqlService } from 'src/repositories/address/address_mysql.repository';
@Injectable()
export class AddressService {
  constructor(private readonly addressRepo: AddressMysqlService) {}
  private readonly logger = new Logger(AddressService.name);

  async createAddress(data: createAddressDto) {
    try {
      const createAddress = await this.addressRepo.createAddress(data);
      if (!createAddress) {
        throw new Error("can't create address");
      } else {
        return createAddress;
      }
    } catch {
      throw new Error("can't create address");
    }
  }

  async getOneAddress(id: number) {
    try {
      const address = await this.addressRepo.getOneAddress(id);
      if (!address) {
        throw new Error("can't get address with given id");
      }
      return address;
    } catch {
      throw new Error("can't get address with given id");
    }
  }

  async getUserAddress(id: number) {
    try {
      const address = await this.addressRepo.getUserAddress(id);
      if (!address) {
        throw new Error("can't get address with given id");
      }
      return address;
    } catch {
      throw new Error("can't get address with given id");
    }
  }
}
