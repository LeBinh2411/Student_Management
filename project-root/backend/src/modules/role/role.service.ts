import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/entity/role/role.entity';
import { Repository } from 'typeorm';

@Injectable() // là 1 decorator , nó đánh dấu class là 1 provider(nhà cung cấp dịch vụ - nhà phát triển)
// mục đích: cho phép class này được inject(tiêm) vào các thành phần khác như controllers, service, hoặc các providers khác
// điều này giúp tổ chức mã theo cách modular và tái sử dụng

//export(xuất) class này sẽ đc cái sử dụng + đc import vào class khác
export class RoleService {
  constructor(
    //hàm khởi tạo, khi 1 đối tượng đc khỏi tạo thì nó sẽ tự động gọi tới contructor, 1 class có nhiều contructor nhưng sẽ khác nhau về tham số
    @InjectRepository(Role) //báo cho nestJS cần thêm 1 đối tương từ Repository<Role> cho entity Role
    // readonly đảm bảo biến roleRepository chỉ chỏ đến Repository<Role> không đc trỏ sang repo khác
    //Repository<Role> là 1 class từ generic từ typeOrm hỗ trợ crud với bảng
    // roleRepository là tham số đc khai báo với kiểu Repository<Role>,roleRepository sẽ lưu các đối tượng của Repository
    // roleRepository sẽ làm vc trực tiếp với bảng Role trong csdl
    private readonly roleRepository: Repository<Role>,
  ) {}

  //async hàm bất đồng bộ  điều này có nghĩa là hàm findAll sẽ thực hiện 1 tác vụ cần thời gian đó là lấy dữ liệu trong db
  // vì là hàm bất đồng bộ nên findAll luôn trả về 1 Promise (Promise như là 1 lời hứa: tôi sẽ trả kết quả sau nhưng bạn phải chờ 1 chút)
  // Promise<Role> trong khai báo để nói với typeScript rằng, hàm này trả về 1 Promise,
  // và khi Promise hoàn thành nó sẽ cho ra 1 mảng các đối tượng kiểu Role
  async findAll(): Promise<Role[]> {
    //this : đại diện cho 1 đối tượng của class RoleService
    // đối tượng này chứa thuốc tính roleRepository
    // khi gọi find, this chính là đối tượng của RoleService và this.roleRepository sẽ truy cập Repository để lấy dữ liệu của bảng Role
    return this.roleRepository.find();
  }

  async findOne(id: number): Promise<Role> {
    console.log('Calling findOne with id:', id);
    try {
      //dùng QueryBuilder của typeORM
      return await this.roleRepository
        .createQueryBuilder('role') //1 phương thức của Repository trong TypeORM, tạo 1 QueryBuilder, querybuilder là 1 công cụ mạnh mẽ cho phép truy vấn sql thay vì viết sql thủ công, ('role') - alias(bí danh) đc gán cho bảng role trong truy vấn SQL
        .select('role.name') //thay vì select * là lấy tất cả, thì ở đây chỉ lấy 1 tên trong bảng role
        .where('role.id = :id', { id }) // where: điều kiện chỉ lấy bản ghi có cột id trong bảng role bằng giá trị của tham số :id, { id } là cú pháp viết tắt của { id: id}, Ví dụ: Nếu gọi findOne(5), thì { id } tương đương với { id: 5 }, nghĩa là tham số :id sẽ được thay bằng giá trị 5 , thì điều kiện WHERE role.id = :id sẽ được thay thế thành WHERE role.id = 5.
        .getOneOrFail(); //nếu không tìm thấy thì ném lỗi EntityNotFoundError
    } catch (error) {
      // giúp debug trong quá trình phát triển , nhưng nó không dừng chương trình hay gửi thông tin đến client
      console.log('🚀 ~ RoleService ~ findOne ~ error:', error);
      //NotFoundException sẽ ném một exception mới với mã HTTP 404 và thông điệp 'Role not found'.
      // phản hồi cho client {
      //"statusCode": 404,
      //"message": "Role not found" }
      throw new NotFoundException('Role not found');
    }
  }

  async findOneName(name: string): Promise<{ name: string }> {
    console.log('Calling findOneName with name:', name);
    try {
      const result = await this.roleRepository //1 đối tượng có các thuộc tính của Repository<Role>
        .createQueryBuilder('role') // tạo 1 query builder để viết code thay thì viết sql thủ công
        .select('role.name') // get name trong bảng role
        .where('role.name = :name', { name }) // điều kiện đc in ra khi tên trong bảng trùng với tham số người dùng nhập vào
        .getOneOrFail(); // giúp nếu không tìn thấy bản ghi nào trả lỗi entityNotFoundError
      return { name: result.name };
    } catch (error) {
      console.log('🚀 ~ RoleService ~ findOneName ~ error:', error);
      throw new NotFoundException('Role not found');
    }
  }
}
