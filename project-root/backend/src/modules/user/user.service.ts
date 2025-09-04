import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { Role } from 'src/entity/role/role.entity';

@Injectable() // là 1 decorato đánh dấu class này 1 provider(nhà phát triển)
// Mục đích cho phép class này đc ịnect(tiêm) vào các thành phần khác như controller, service hoặc các provider khác
export class UserService {
  constructor(
    // hàm khởi tạo, khi 1 đối tượng được khởi tạo thì nó sẽ tự động gọi tới contructor
    @InjectRepository(User) //Báo cho nestJS cần 1 đối tượng từ Repository<User> để thao tác với bảng User, cho phép thực hiện các truy vấn hoặc thao tác dữ liệu liên quan đến User
    // readonly đảm bảo biến userRepository chỉ chỏ đến Repository<User>, k chỏ đến class khác
    // Repository<User> là 1 class từ typeORM hỗ trợ crud với bảng User
    // userRepository là tham số, với kiểu Repository<Role>
    // userRepository sẽ lưu các đối tượng của Repository<User>, và sẽ làm việc trực tiếp với bảng Role trong csdl
    private readonly userRepository: Repository<User>,

    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {
    console.log('UserRepository:', this.userRepository);
    console.log('RoleRepository:', this.roleRepository);
  }

  async findAll(): Promise<User[]> {
    const users = await this.userRepository
      .createQueryBuilder('user')
      .select(['user.id', 'user.userName', 'user.password']) //cách lấy các dữ liệu muốn hiển thị dựa vào alias 'user' để tham chiếu, userName phải theo entiry User
      .leftJoin('user.role', 'role') // thực hiện join dựa theo mối quan hệ trong bảng User
      .addSelect(['role.name']) // giới hạn cột từ role
      .getMany(); // thực thi truy vấn và trả về mảng các đối tượng user
    return users;
  }
  //   async findAll(): Promise<User[]> {
  //     // async là hàm bất đồng bộ cho nên hàm fillAll() sẽ thực hiện 1 nhiệm vụ cần nhiều thời gian
  //     // Vì là hàm bất đồng bộ cho nên luôn trả về 1 Promise( Promise như là 1 lời hứa: tôi sẽ trả kết quả nhưng bạn phải chờ 1 chút)
  //     // và khi promise hoàn thành nó sẽ trả ra 1 mảng đối tượng kiểu User
  //     // return this.userRepository.find();
  //     const users = await this.userRepository // 1 đối tượng có các thuộc tính của Repository<Role>
  //       .createQueryBuilder('user') // tạo 1 query builder để viết code thay vì viết sql thủ công, ('user') là bí danh đc gán cho bảng role trong truy vấn sql
  //       .leftJoinAndSelect('user.role', 'role')
  //       .getMany(); //thực thi truy vấn và trả về một mảng các đối tượng User, mỗi đối tượng có thuộc tính role đã được populate (điền dữ liệu).
  //     return users;
  //     /*.leftJoinAndSelect('user.role', 'role'):
  // leftJoinAndSelect là một phương thức của QueryBuilder, thực hiện một left join (join trái) giữa bảng user và bảng role dựa trên mối quan hệ đã định nghĩa trong entity User.
  // 'user.role': Tham chiếu đến thuộc tính role trong entity User, được định nghĩa bằng @ManyToOne(() => Role, ...). Đây là mối quan hệ với bảng role, và leftJoinAndSelect đảm bảo rằng dữ liệu từ bảng role được tải cùng với user, ngay cả khi không có bản ghi role tương ứng (vì là left join).
  // 'role': Là alias cho bảng role trong truy vấn, dùng để tham chiếu các cột từ bảng role nếu cần.
  // Ý nghĩa: Phương thức này tải dữ liệu từ cả hai bảng, bao gồm các trường của user và role liên quan, thay vì chỉ lấy dữ liệu từ user như find() đơn thuần.*/
  //   }

  async findOne(id: number): Promise<User> {
    const result = await this.userRepository
      .createQueryBuilder('user') // tạo 1 query builder để thay viết sql thủ công
      .select(['user.id', 'user.userName', 'user.password'])
      .leftJoin('user.role', 'role')
      .addSelect(['role.name'])
      .where('user.id = :id', { id })
      .getOneOrFail();
    return result;
  }

  //Promise<User> cam kết sẽ trả về 1 đối tượng User sau khi hoàn tất
  async create(createUser: CreateUserDto): Promise<User> {
    // check id role có tồn tại hay không
    const role = await this.roleRepository.findOne({
      where: { id: createUser.roleId },
    });
    if (!role) {
      throw new NotFoundException(
        `Role id= ${createUser.roleId} không tồn tại`,
      );
    }
    // tạo user mới 1 đối tượng
    const newUser = this.userRepository.create({
      //createUser.userName: lấy dữ liệu từ dto gán cho userName
      userName: createUser.userName,
      password: createUser.password,
      role: role,
    });

    // lưu vào DB
    return await this.userRepository.save(newUser);
  }

  // async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
  //   //tìm id user
  //   const users = await this.userRepository.findOne({
  //     where: { id: id },
  //   });
  //   if (!users) {
  //     throw new NotFoundException(`User id=${id} không tồn tại `);
  //   }
  //   //cập nhật dữ liệu
  //   const updateUser = {
  //     ...users,
  //     ...updateUserDto,
  //     role: updateUserDto.roleId
  //       ? ({ id: updateUserDto.roleId } as Role)
  //       : users.role,
  //   };

  //   //lưu vào db
  //   return await this.userRepository.save(updateUser);
  // }
}
