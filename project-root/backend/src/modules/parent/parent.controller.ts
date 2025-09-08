import { Controller, Get } from '@nestjs/common';
import { ParentService } from './parent.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Parent - Phụ huynh')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all parent' })
  async findAll() {
    return this.parentService.findAll();
  }
}
