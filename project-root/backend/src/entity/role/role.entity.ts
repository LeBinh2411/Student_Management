import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../user/user.entity';

@Entity('role')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'name', type: 'varchar', unique: true })
  name: string; // vd 'admin', 'parent', studen

  @OneToMany(() => User, (user) => user.role)
  // () => User : join với bảng User
  // (user) => user.role : user là 1 biến đại diện cho từng dòng trong User,
  // user.role : ở bảng User có 1 thuộc tính role, biết đc role chính là khóa ngoại bên User
  users?: User[];
  //vì đây là cột ảo, nên dùng ?, để tránh TypeScript check lỗi.
}
