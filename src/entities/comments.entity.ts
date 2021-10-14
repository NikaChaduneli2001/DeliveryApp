import { IsOptional } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { OrdersEntity } from './orders.entity';
import { UsersEntity } from './users.entity';

@Entity('comments')
export class CommentsEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => UsersEntity, (user) => user.id, { eager: true })
  user: number | UsersEntity;
  @ManyToOne(() => OrdersEntity, (order) => order.id, { eager: true })
  order: number | OrdersEntity;
  @Column({
    type: 'datetime',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @IsOptional()
  date: Date;
  @Column({ type: 'varchar', length: 300 })
  comment: string;
}
