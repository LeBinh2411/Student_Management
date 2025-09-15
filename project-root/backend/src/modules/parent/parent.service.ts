import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Parent } from 'src/entity/parent/parent.entity';
import { Repository } from 'typeorm';
import { CreateParentDto } from './dto/create-parent.dto';
import { User } from 'src/entity/user/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable() // đánh dấu class này là 1 provider nhà phát triển giúp, inject(tiêm) vào các thành phần khác như controller, service hoặc các provider khác
export class ParentService {
  private readonly logger = new Logger(ParentService.name);

  constructor(
    @InjectRepository(Parent) // báo cho nestJS cần 1 đối tượng từ Repository<Parent> để thao tác với bảng User, cho phép thực hiện các truy vấn hoặc thao tác dữ liệu liên quan đến Parent
    private readonly parentRepository: Repository<Parent>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly configService: ConfigService,
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

  async create(
    createParent: CreateParentDto,
    file?: Express.Multer.File,
  ): Promise<Parent> {
    //check id user xem tồn tại không
    const users = await this.userRepository.findOne({
      where: { id: createParent.userId },
    });
    if (!users) {
      throw new NotFoundException(
        `User id = ${createParent.userId} không tồn tại`,
      );
    }
    //check user id đã có parent chưa
    const existingParent = await this.parentRepository.findOne({
      where: { user: { id: createParent.userId } },
    });
    if (existingParent) {
      throw new BadRequestException(
        `User id = ${createParent.userId} đã có parent`,
      );
    }
    // let avatarUrl: string;
    // if (file) {
    //   // if (
    //   //   !file.filename ||
    //   //   !['image/png', 'image/jpeg'].includes(file.mimetype)
    //   // ) {
    //   //   throw new BadRequestException('Chỉ chấp nhận file PNG hoặc JPG');
    //   // }
    //   avatarUrl = `${this.configService.get<string>('UPLOAD_PATH', '/uploads')}/${file.filename}`;
    // } else {
    //   avatarUrl = this.configService.get<string>(
    //     'DEFAULT_AVATAR',
    //     '/uploads/default-avatar.png',
    //   );
    // }
    //Xử lý file + check dung lượng file

    // 3. Xử lý avatar (file đã được pipe validate xong rồi)
    let avatarUrl = this.configService.get<string>(
      'DEFAULT_AVATAR',
      '/uploads/default-avatar.png',
    );

    if (file) {
      avatarUrl = `${this.configService.get<string>(
        'UPLOAD_PATH',
        '/uploads',
      )}/${file.filename}`;
    }
    //Tạo 1 đối tượng parent mới
    const newParent = this.parentRepository.create({
      avatarUrl,
      fullName: createParent.fullName,
      phoneNumber: createParent.phoneNumber,
      email: createParent.email,
      address: createParent.address,
      user: users,
    });
    // Lưu parent mới vào database và trả về entity đã lưu
    return this.parentRepository.save(newParent);
  }
}
