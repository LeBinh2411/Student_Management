import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateParentDto {
  @IsOptional() // có thể để trống
  @IsString()
  //@ApiProperty({ example: 'default-avatar.png', description: 'Ảnh người dùng' })
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  avatarUrl?: string;

  @IsNotEmpty({ message: 'Full Name không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  @Length(3, 50, { message: 'FullName phải từ 3 đến 50 ký tự' })
  @ApiProperty({ example: 'Phụ huynh A', description: 'Tên phụ huynh' })
  fullName: string;

  @IsNotEmpty({ message: 'Phone Number không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự số 0 - 9' })
  @ApiProperty({ example: '0972899999', description: 'SDT phụ huynh' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Email không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  @ApiProperty({ example: 'A123@gmail.com', description: 'Email phụ huynh' })
  email: string;

  @IsNotEmpty({ message: 'Address không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  @ApiProperty({ example: 'Địa chỉ A', description: 'Địa chỉ phụ huynh' })
  address: string;

  @IsNotEmpty({ message: 'User ID không được để trông' })
  @Type(() => Number) // 👈 ép string -> number trước khi validate
  @IsNumber({}, { message: 'User ID phải là số' })
  @Min(1, { message: 'User ID phải lớn hơn hoặc bằng 1' })
  @Max(1000, { message: 'User ID phải nhỏ hơn hoặc bằng 1000' })
  @ApiProperty({ example: '1', description: 'Id user' })
  userId: number;
}
