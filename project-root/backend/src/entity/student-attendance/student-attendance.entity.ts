import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Student } from '../student/student.entity';
import { DailyClass } from '../daily/daily.entity';

//Điểm danh học sinh
@Entity('student-attendance')
export class StudentAttendance {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Student, (student) => student.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'student_id' }) // khóa ngoại
  student: Student;

  @ManyToOne(() => DailyClass, (dailyClass) => dailyClass.attendances, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'daily_class_id' }) // khóa ngoại
  dailyClass: DailyClass;

  @Column({ name: 'trang_thai', type: 'varchar' })
  status: string;

  @Column({ name: 'ly_do', type: 'text' })
  note: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;
}
