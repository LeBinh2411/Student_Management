import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Role } from 'src/entity/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Role])], //đăng ký repository để được làm việc với bảng Role
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // xuất nếu cần dùng ở module khác
})
export class UserModule {}
