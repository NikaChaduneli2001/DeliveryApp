import { UsersInterface } from './users-interface';

export interface AddressInterface {
  id?: number;
  user?: number | UsersInterface;
  streetAddress: string;
}
