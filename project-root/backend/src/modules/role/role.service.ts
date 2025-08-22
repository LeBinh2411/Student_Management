import { Injectable } from '@nestjs/common';
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
    return this.roleRepository.find();
  }
}
