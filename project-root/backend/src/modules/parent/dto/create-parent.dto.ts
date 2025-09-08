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
  avatarUrl: string;

  @IsNotEmpty({ message: 'Full Name không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  @Length(3, 50, { message: 'FullName phải từ 3 đến 50 ký tự' })
  fullName: string;

  @IsNotEmpty({ message: 'Phone Number không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự số 0 - 9' })
  phoneNumber: string;

  @IsNotEmpty({ message: 'Email không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  email: string;

  @IsNotEmpty({ message: 'Address không được để trông' })
  @IsString({ message: 'Phải là chuỗi ký tự' })
  address: string;

  @IsNotEmpty({ message: 'UserId không được để trông' })
  @IsNumber({}, { message: 'RoleId phải là số' })
  @Min(1, { message: 'RoleId phải lớn hơn hoặc bằng 1' })
  @Max(1000, { message: 'RoleId phải nhỏ hơn hoặc bằng 1000' })
  userId: number;
}
