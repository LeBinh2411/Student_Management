import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { Student } from '../student/student.entity';

@Entity('parent')
export class Parent {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'avatar_url', type: 'varchar' })
  avatarUrl: string;

  @Column({ name: 'full_name', type: 'varchar', length: 50 })
  fullName: string;

  @Column({ name: 'phone_number', type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ nullable: true, type: 'varchar', length: 100 })
  email: string;

  @Column({ nullable: true, type: 'text' })
  address: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => User) // join với bảng User qua khóa chính của bảng User
  @JoinColumn({ name: 'user_id' }) //khóa ngoại
  user: User;

  @OneToMany(() => Student, (student) => student.parent)
  // @JoinColumn({ name: 'student_id' })
  students?: Student[]; // thuộc tính này sẽ là 1 mảng các Student gắn với Parent này
}
