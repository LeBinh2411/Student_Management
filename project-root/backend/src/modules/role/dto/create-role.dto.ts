import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateRoleDto {
  @IsString({ message: 'Name phải là chuỗi ký tự' })
  @Length(3, 20, { message: 'Ký tự phải lớn hơn 3 và nhỏ hơn 15' })
  @ApiProperty({ example: 'admin' })
  name: string;
}
