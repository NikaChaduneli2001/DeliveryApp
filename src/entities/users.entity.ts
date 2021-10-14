import { Role } from 'src/enums/role.enum';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity('users')
@Unique(['email','phoneNumber'])
export class UsersEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column('varchar', {
    length: 100,
  })
  fullName: string;
  @Column('varchar', {
    length: 100,
  })
  hash: string;
  @Column('varchar', {
    length: 50,
  })
  email: string;
  @Column('varchar', {
    length: 100,
  })
  address: string;
  @Column('int')
  phoneNumber: number;
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
  @Column({
    type: 'boolean',
    default: false,
  })
  isDeleted: boolean;
}
