import { Controller, Get, Param } from '@nestjs/common';
import { RoleService } from './role.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    return this.roleService.findOne(id);
  }

  @ApiOperation({ summary: 'Get name by name' })
  @Get('/byname/:name')
  async findOneName(@Param('name') name: string) {
    return this.roleService.findOneName(name);
  }
}
