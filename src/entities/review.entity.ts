import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrdersEntity } from './orders.entity';
import { UsersEntity } from './users.entity';

@Entity('review')
export class ReviewEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', { length: 300 })
  comment: string;
  @Column('int', { default: 0 })
  stars: number;
  @ManyToOne(() => OrdersEntity, (order) => order.id)
  order: number | OrdersEntity;

  @ManyToOne(() => UsersEntity, (user) => user.id)
  user: number | UsersEntity;
}
