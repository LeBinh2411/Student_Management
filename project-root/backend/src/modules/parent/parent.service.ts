import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from 'src/entity/parent/parent.entity';
import { Repository } from 'typeorm';
import { CreateParentDto } from './dto/create-parent.dto';
import { User } from 'src/entity/user/user.entity';

@Injectable() // đánh dấu class này là 1 provider nhà phát triển giúp, inject(tiêm) vào các thành phần khác như controller, service hoặc các provider khác
export class ParentService {
  constructor(
    @InjectRepository(Parent) // báo cho nestJS cần 1 đối tượng từ Repository<Parent> để thao tác với bảng User, cho phép thực hiện các truy vấn hoặc thao tác dữ liệu liên quan đến Parent
    private readonly parentRepository: Repository<Parent>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Parent[]> {
    const parent = await this.parentRepository
      .createQueryBuilder('parent') //khoi taoj crQuery để viết code thay vì phải viết SQL
      .select([
        'parent.id',
        'parent.avatarUrl',
        'parent.fullName',
        'parent.phoneNumber',
        'parent.email',
        'parent.address',
        'parent.createdAt',
        'parent.updatedAt',
      ])
      .leftJoin('parent.user', 'user')
      .addSelect(['user.id', 'user.userName', 'user.password'])
      .getMany();
    return parent;
  }

  //   async create(createParent: CreateParentDto): Promise<Parent> {
  //     //check id user xem tồn tại không
  //     const users = await this.userRepository.findOne({
  //       where: { id: createParent.userId },
  //     });
  //     if (!users) {
  //       throw new NotFoundException(
  //         `User id= ${createParent.userId} không tồn tại`,
  //       );
  //     }
  //     //
  //   }
}
