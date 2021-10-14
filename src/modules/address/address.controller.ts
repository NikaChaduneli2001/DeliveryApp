import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { createAddressDto } from 'src/dto/create-address.dto';
import {
  getErrorMessage,
  getSuccessMessage,
} from 'src/utils/response-functions.utils';
import { AddressService } from './address.service';

@Controller('address')
export class AddressController {
  private readonly logger = new Logger(AddressController.name);
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async createAddress(@Body() data: createAddressDto) {
    this.logger.log(`create address body: ${JSON.stringify(data)}`);
    try {
      const address = await this.addressService.createAddress(data);
      this.logger.log(`create address: ${JSON.stringify(address)}`);
      if (!address) {
        this.logger.error(`could not created address`);
        return getErrorMessage('could not created address');
      }
      return getSuccessMessage(address);
    } catch (err) {
      this.logger.error(
        `could not create address with given params data : ${JSON.stringify(
          data,
        )} err:${JSON.stringify(err)}`,
      );
      return getErrorMessage('could not create address with given params');
    }
  }
  @Get(':id')
  async getOneAddress(@Param('id') id: number) {
    this.logger.log(`get One Address's id :${JSON.stringify(id)}`);
    try {
      const address = await this.addressService.getOneAddress(id);
      this.logger.log(`find address with id : ${JSON.stringify(address)}`);
      if (!address) {
        this.logger.error(`could not found address`);
        return getErrorMessage('Could not find address with given id');
      }
      return getSuccessMessage(address);
    } catch (err) {
      this.logger.error(
        `could not found address with given id :${JSON.stringify(
          id,
        )}, err ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not find address with given id');
    }
  }
  @Get('user/:id')
  async getUserAddress(@Param('id') id: number) {
    this.logger.log(`get One Address's id :${JSON.stringify(id)}`);
    try {
      const address = await this.addressService.getUserAddress(id);
      this.logger.log(`find address with id : ${JSON.stringify(address)}`);
      if (!address) {
        this.logger.error(`could not found address`);
        return getErrorMessage('Could not find address with given id');
      }
      return getSuccessMessage(address);
    } catch (err) {
      this.logger.error(
        `could not found address with given id :${JSON.stringify(
          id,
        )}, err ${JSON.stringify(err)}`,
      );
      return getErrorMessage('Could not find address with given id');
    }
  }
}
