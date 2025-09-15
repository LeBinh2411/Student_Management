import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ParentService } from './parent.service';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateParentDto } from './dto/create-parent.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Parent } from 'src/entity/parent/parent.entity';
import { ImageValidationPige } from 'src/pipes/image-validation.pipe';

@ApiTags('Parent - Phụ huynh')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all parent' })
  async findAll() {
    return this.parentService.findAll();
  }

  @Post()
  @UseInterceptors(FileInterceptor('avatar')) // Xử lý file upload từ trường 'avatar'
  @ApiOperation({
    summary: 'Tạo mới một Parent với avatar (có thể không upload)',
  })
  @ApiConsumes('multipart/form-data') // Chỉ định yêu cầu là multipart/form-data
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: { type: 'string', format: 'binary', nullable: true },
        userId: { type: 'number', example: 1 },
        fullName: { type: 'string', example: 'Phụ huynh A' },
        phoneNumber: { type: 'string', example: '0972899999' },
        email: { type: 'string', example: 'a@a.com' },
        address: { type: 'string', example: 'Địa chỉ A' },
      },
      required: ['userId', 'fullName'],
    },
  })
  async create(
    @Body() createParentDto: CreateParentDto,
    @UploadedFile(new ImageValidationPige()) file?: Express.Multer.File, // validate file bằng Pipe riêng
  ): Promise<Parent> {
    return this.parentService.create(createParentDto, file);
  }
}
