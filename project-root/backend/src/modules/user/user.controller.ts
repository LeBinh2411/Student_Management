import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('User - Người dùng')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all user' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get name by id' })
  @ApiParam({ name: 'id', required: true, example: 1, description: 'User ID' })
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Add user' })
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  @Patch('/:id')
  @ApiParam({ name: 'id', required: true, example: 0, description: 'User ID' })
  @ApiOperation({ summary: 'Update user by id' })
  async update(@Param('id') id: number, @Body() updateUser: CreateUserDto) {
    return this.userService.update(id, updateUser);
  }

  @Delete('/:id')
  @ApiParam({ name: 'id', required: true, example: 0, description: 'User ID' })
  @ApiOperation({ summary: 'Delete user by id' })
  async delete(@Param('id') id: number) {
    await this.userService.delete(id);
    return { message: `User id= ${id} đã xóa thành công` };
  }
}
