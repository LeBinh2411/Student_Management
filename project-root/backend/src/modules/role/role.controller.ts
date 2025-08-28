import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateRoleDto } from './dto/create-role.dto';

@ApiTags('Role - Quyền')
@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @ApiOperation({ summary: 'Get all role' })
  @Get()
  async findAll() {
    return this.roleService.findAll();
  }

  @ApiOperation({ summary: 'Get name by id' })
  @ApiParam({ name: 'id', required: true, example: 1, description: 'Role ID' })
  // name: 'id' - tên tham số trong URL trong route /role/{id}
  // required: true - tham số này sẽ hiện trong Swagger, nếu false thì sẽ bỏ trống trong swagger
  // example: 1 - giá trị mẫu mặc định khi swagger hiển thị
  // description: 'Role ID' - mô tả ngắn gọn về tham số
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @ApiParam({
    name: 'name',
    required: true,
    example: 'admin',
    description: 'Role Name',
  })
  @ApiOperation({ summary: 'Get name by name' })
  @Get('/byname/:name')
  async findOneName(@Param('name') name: string) {
    return this.roleService.findOneName(name);
  }

  @ApiOperation({ summary: 'Add name Role' })
  @Post('/addRole')
  //@Body() lấy dữ liệu trong request body(json khi client gửi)
  //body: CreateRoleDto , body tên biến chứa dữ liệu client, CreateRole là kiểu dữ liệu của body
  async create(@Body() body: CreateRoleDto) {
    return this.roleService.saveRole(body);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true, example: 0, description: 'RoleID' })
  @ApiOperation({ summary: 'Delete name by id' })
  //@Param('id', ParseIntPipe) lấy tham số id từ url, parseIntPipe giúp chuyển chuỗi thành number, VD: "5" --> 5, nếu người dùng nhập abc sẽ lỗi
  //id: number biến id nhận giá trị đã parse thành số
  async deleteRole(@Param('id', ParseIntPipe) id: number) {
    await this.roleService.deleteRole(id);
    return { message: `Role id=${id} đã được xóa thành công` }; // sau khi xóa trả về JSON thông báo cho client
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRoleDto: CreateRoleDto,
  ) {
    return this.roleService.updateRole(id, updateRoleDto);
  }
}
