import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Parent } from '../parent/parent.entity';
import { StudentAttendance } from '../student-attendance/student-attendance.entity';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Parent, (parent) => parent.students, { onDelete: 'CASCADE' })
  //parent sẽ join đến parent thông qua id
  //onDelete: 'CASCADE': khi 1 phụ huynh bị xóa các bảng con tham chiếu tới bị xóa theo
  @JoinColumn({ name: 'parent_id' }) // Khóa ngoại
  parent: Parent;

  @Column({ name: 'avatar_url', type: 'varchar', length: 255 })
  avatarUrl: string;

  @Column({ name: 'full_name', type: 'varchar', length: 50 })
  fullName: string;

  @Column({ name: 'date_of_birth', type: 'date' })
  dateOfBirth: Date;

  @Column({ name: 'class_level', type: 'varchar', length: 50 })
  classLevel: string;

  @OneToMany(() => StudentAttendance, (attendance) => attendance.student)
  attendances: StudentAttendance[];

  //decorator này khác column thường, nó tự động set giá trị = thời điểm record được insert lần đầu
  //có cả ngày + giờ
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  //decorator này tự động update = thời điểm record bị update lần cuối
  //mỗi khi save() hoặc update() entity, field này sẽ được cập nhật lại
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
