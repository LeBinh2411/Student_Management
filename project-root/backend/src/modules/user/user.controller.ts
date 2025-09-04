import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all user' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.userService.findOne(id);
  }

  @ApiOperation({ summary: 'Add user' })
  @Post()
  async create(@Body() body: CreateUserDto) {
    return this.userService.create(body);
  }

  // @Patch(':id')
  // async update(@Param('id') id: number, @Body() updateUser: CreateUserDto) {
  //   return this.userService.update(id, updateUser);
  // }
}
