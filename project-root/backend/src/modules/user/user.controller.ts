import { Controller, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiOperation } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all user' })
  @Get()
  async findAll() {
    return this.userService.findAll();
  }
}
