import { RestaurantType } from 'src/enums/restaurant-type.enum';
import { UsersInterface } from 'src/interface/users-interface';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('restaurant')
@Unique(['address', 'name'])
export class RestaurantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  user: number | UsersInterface;
  @Column('varchar', {
    length: 100,
  })
  address: string;

  @Column('varchar', {
    length: 100,
  })
  name: string;

  @Column({
    type: 'enum',
    enum: RestaurantType,
  })
  type: RestaurantType;

  @Column('float', {
    default: 0,
  })
  rating: number;
  @Column('float', {
    default: 0,
  })
  reviewCount: number;
  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}
