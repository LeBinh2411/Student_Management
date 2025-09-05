import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'UserName không được để trống' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  @Length(3, 50, { message: 'UserName phải từ 3 đến 50 ký tự' })
  @ApiProperty({ example: 'user1', description: 'Tên người dùng' })
  userName: string;

  @IsNotEmpty({ message: 'Password không được để trống' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  @Length(6, 100, { message: 'Password phải từ 6 đến 100 ký tự' })
  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  password: string;

  @IsNotEmpty({ message: 'RoleId không được để trống' })
  @IsNumber({}, { message: 'RoleId phải là số' })
  @Min(1, { message: 'RoleId phải lớn hơn hoặc bằng 1' })
  @Max(1000, { message: 'RoleId phải nhỏ hơn hoặc bằng 1000' }) // Giả định giới hạn
  @ApiProperty({ example: 1, description: 'ID của Role' })
  roleId: number; // chỉ chuyền id của Role
}
