import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], //đăng ký repository để được làm việc với bảng Role
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
