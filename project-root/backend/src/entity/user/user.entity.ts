import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Role } from '../role/role.entity';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn() //khóa chính tự tăng
  id: number;

  @Column({ name: 'user_name', type: 'varchar', unique: true }) //không trùng
  userName: string;

  @Column({ name: 'password', type: 'varchar' })
  password: string;

  @ManyToOne(() => Role, (role) => role.users)
  //() => Role: join với bảng Role
  //(role) => role.users): role biến đại diện cho bảng Role, role.users: báo bên bảng Role có 1 trường là users
  @JoinColumn({ name: 'role_id' }) //khóa ngoại
  role: Role;
}
