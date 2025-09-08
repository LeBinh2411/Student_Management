import { Module } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ParentController } from './parent.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from 'src/entity/parent/parent.entity';
import { User } from 'src/entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Parent, User])], // Đăng ký repository để đc làm việc với bảng Role
  controllers: [ParentController],
  providers: [ParentService],
})
export class ParentModule {}
