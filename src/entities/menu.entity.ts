import { MenuType } from 'src/enums/menu-type.enum';
import { RestaurantType } from 'src/enums/restaurant-type.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RestaurantEntity } from './restaurant.entity';

@Entity('menu')
export class MenuEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => RestaurantEntity, (res) => res.id, { eager: true })
  restaurant: number | RestaurantEntity;
  @Column({
    type: 'varchar',
    length: 78,
  })
  itemName: string;
  @Column({
    type: 'enum',
    enum: MenuType,
  })
  type: MenuType;
  @Column({
    type: 'varchar',
    length: 78,
  })
  description: string;
  @Column({
    type: 'varchar',
    length: 78,
  })
  sumbnail: string;
  @Column({
    type: 'float',
  })
  price: number;
  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}
