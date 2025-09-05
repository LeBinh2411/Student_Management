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

  async update(id: number, updateUserDto: CreateUserDto): Promise<User> {
    //check xem id user tồn tại k
    const users = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!users) {
      throw new NotFoundException(`User id=${id} không tồn tại `);
    }

    //check roleId có tồn tại k
    const role = await this.roleRepository.findOne({
      where: { id: updateUserDto.roleId },
    });
    if (!role) {
      // throw: lém lỗi ra ngoài, dừng function hiện tại
      // NotFoundException: một Exception trong NestJS, tương ứng với HTTP status code 404 Not Found.
      throw new NotFoundException(
        `Role id=${updateUserDto.roleId} không tồn tại`,
      );
    }

    //cập nhật dữ liệu
    await this.userRepository
      .createQueryBuilder() // Tạo QueryBuilder để xây dựng truy vấn SQL tùy chỉnh cho bảng User.
      .update(User) // Chỉ định rằng đây là lệnh UPDATE, áp dụng trên bảng User trong database.
      .set({
        //truyền các cột cần thay đổi
        userName: updateUserDto.userName, // Cập nhật cột userName trong bảng với giá trị userName từ DTO.
        password: updateUserDto.password,
        role: { id: updateUserDto.roleId }, //gán roleId mới cho user vì quan hệ @ManyToOne, nên roleId phải = id của bảng Role
      })
      .where('id = :id', { id: id }) // điều kiện update
      .execute(); // Thực thi truy vấn UPDATE và update dữ liệu trong db, không trả về dữ liệu thô

    // Tìm lại bản ghi User dựa trên id sau khi cập nhật để đảm bảo dữ liệu mới.
    const updatedUser = await this.userRepository.findOne({
      where: { id }, // Lọc bản ghi dựa trên id của user đã cập nhật.
      relations: ['role', 'role.users'], // Tải thêm dữ liệu liên quan, bao gồm role và danh sách users trong role để trả về entity đầy đủ.
    });

    // In ra bản ghi updateResult có gì
    console.log('Update User:', updatedUser);

    // Kiểm tra nếu không tìm thấy user sau cập nhật, tránh trả về undefined.
    if (!updatedUser) {
      throw new NotFoundException(
        `Không thể tìm thấy user id=${id} sau khi cập nhật`,
      );
    }

    // Trả về entity User đã cập nhật,
    return updatedUser;
  }

  async delete(id: number): Promise<boolean> {
    //check id có tồn tại không
    const user = await this.userRepository.findOne({
      where: { id: id },
    });
    if (!user) {
      throw new NotFoundException(`User id= ${id} không tồn tại`);
    }

    //dùng typeORM xóa
    const deleteResult = await this.userRepository
      .createQueryBuilder()
      .delete() //chỉ dịnh đây là lệnh delete
      .from(User) // xác định bảng xóa
      .where('id = :id', { id: id }) // điều kiện để xóa
      .execute(); //thực thi truy delete vào db

    // Kiểm tra xem xóa có thành công không dựa trên số bản ghi bị ảnh hưởng
    if (deleteResult.affected === 0) {
      throw new Error(`Xóa user id=${id} thất bại`); // Ném lỗi nếu không có bản ghi nào bị xóa
    }

    // Trả về true nếu xóa thành công, báo hiệu quá trình hoàn tất
    return true;
  }
}
