import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { StudentAttendance } from '../student-attendance/student-attendance.entity';

//
@Entity('daily-class')
export class DailyClass {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'ngay_hoc', type: 'date' })
  //type:'date' : chỉ lưu ngày tháng năm
  date: Date;

  @Column({ name: 'ca_hoc' }) // VD: ca7 lớp 2a1
  caHoc: number;

  @Column({ name: 'start_time', type: 'time' })
  // type:'time' : kiểu dữ liệu cột trong DB chỉ lưu giờ phút giây (không có ngày)
  //Trong TypeScript vẫn dùng string để nhận giá trị (VD: '17:00:00')
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'cap_do', type: 'varchar' })
  step: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp', //Kiểu dữ liệu trong db giúp nhìn vào timezone hiện tại của session/server
    //rồi chuyển ngược từ UCT sang timezone
    default: () => 'CURRENT_TIMESTAMP', // Giúp insert dữ liệu trực tiếp trong db, sẽ tự động set ngày + time lúc đó
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => StudentAttendance, (attendance) => attendance.dailyClass)
  attendances: StudentAttendance[];
}
