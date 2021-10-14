import { IsOptional } from 'class-validator';
import { orderStatus } from 'src/enums/order-status.enum';
import { orderListInterface } from 'src/interface/orderList.interface';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UsersEntity } from './users.entity';

@Entity('orders')
export class OrdersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  user: number | UsersEntity;
  @Column('varchar', { nullable: true })
  orderList: string;
  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  deliveryAddress: string;

  @Column({
    type: 'datetime',
  })
  @IsOptional()
  date: Date;
  @Column({
    type: 'enum',
    enum: orderStatus,
  })
  status: orderStatus;
  @Column({
    type: 'boolean',
    default: false,
    nullable: true,
  })
  rateStatus: boolean;
  @Column('decimal', { precision: 9, scale: 2 })
  totalPrice: number;
}
