import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
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
  @UseInterceptors(FileInterceptor('avatarUrl')) // Xử lý file upload từ trường 'avatar'
  // Sử dụng FileInterceptor để xử lý file upload từ trường 'avatar' trong form-data, lưu vào thư mục mặc định (thường ./uploads)
  @ApiOperation({
    summary: 'Tạo mới một Parent với avatar (có thể không upload)',
  })
  @ApiConsumes('multipart/form-data') // Chỉ định yêu cầu là multipart/form-data
  @ApiBody({
    // Định nghĩa schema cho body của request trong Swagger
    // - type: 'object': Dữ liệu là một object
    // - properties: Liệt kê các trường, bao gồm:
    // - required: Chỉ định userId và fullName là bắt buộc
    schema: {
      type: 'object',
      properties: {
        avatarUrl: { type: 'string', format: 'binary', nullable: true },
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
    @UploadedFile(new ImageValidationPige()) file?: Express.Multer.File, //lấy file từ avatar, áp dụng ImageValidationPige để validate, file? đánh dấu là tùy chọn(undefined nếu k upload)
  ): Promise<Parent> {
    return this.parentService.create(createParentDto, file); // Gửi dữ liệu và file đến service để xử lý logic tạo Parent
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Parent by id' })
  @UseInterceptors(FileInterceptor('avatarUrl'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatarUrl: { type: 'string', format: 'binary', nullable: true },
        userId: { type: 'number', example: 1 },
        fullName: { type: 'string', example: 'Phụ huynh A' },
        phoneNumber: { type: 'string', example: '0972899999' },
        email: { type: 'string', example: 'a@a.com' },
        address: { type: 'string', example: 'Địa chỉ A' },
      },
    },
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateParentDto: CreateParentDto,
    @UploadedFile(new ImageValidationPige()) file?: Express.Multer.File,
  ): Promise<Parent> {
    return this.parentService.update(id, updateParentDto, file);
  }
}
