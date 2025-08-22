import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from 'src/entity/role/role.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Role])], // đăng ký repository để làm vc với bảng Role
  controllers: [RoleController],
  providers: [RoleService],
})
export class RoleModule {}
