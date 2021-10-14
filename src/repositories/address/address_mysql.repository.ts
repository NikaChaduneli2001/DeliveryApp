import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createAddressDto } from 'src/dto/create-address.dto';
import { AddressEntity } from 'src/entities/address.entity';
import { AddressInterface } from 'src/interface/address.interface';

import { Repository } from 'typeorm';

@Injectable()
export class AddressMysqlService {
  private readonly logger = new Logger(AddressMysqlService.name);
  constructor(
    @InjectRepository(AddressEntity)
    private readonly AddressRepository: Repository<AddressEntity>,
  ) {}

  async createAddress(data: createAddressDto): Promise<AddressInterface> {
    this.logger.log(`create address data : ${JSON.stringify(data)}`);
    const newAddress = new AddressEntity();
    newAddress.streetAddress = data.streetAddress;
    newAddress.user = data.user;

    const address = await this.AddressRepository.save(newAddress);
    this.logger.log(`created address ${JSON.stringify(address)}`);
    if (!address) {
      this.logger.error(`could not created address ${JSON.stringify(address)}`);
      return null;
    }
    return {
      id: address.id,
      streetAddress: address.streetAddress,
      user: address.user,
    };
  }

  async getOneAddress(id: number): Promise<AddressInterface> {
    const address = await this.AddressRepository.findOne({ id });
    if (!address) {
      throw new Error("can't find address");
    }
    return {
      id: address.id,
      streetAddress: address.streetAddress,
      user: address.user,
    };
  }

  async getUserAddress(userId: number): Promise<any> {
    const address = await this.AddressRepository.find({ user: userId });
    if (!address) {
      throw new Error("can't find address");
    }
    return address.map((res) => ({
      id: res.id,
      streetAddress: res.streetAddress,
      user: {
        fullName: res.user['fullName'],
        phoneNumber: res.user['phoneNumber'],
        address: res.user['address'],
        role: res.user['role'],
      },
    }));
  }

  async checkAddress(address: string) {
    this.logger.log(`found address ${address}`);
    const foundAddress = await this.AddressRepository.createQueryBuilder('add')
      .where('add.streetAddress=:address', { address })
      .getMany();
    this.logger.log(`found address ${foundAddress}`);
    return foundAddress.length === 0;
  }
}
