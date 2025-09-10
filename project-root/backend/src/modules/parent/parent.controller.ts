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

@ApiTags('Parent - Phụ huynh')
@Controller('parent')
export class ParentController {
  constructor(private readonly parentService: ParentService) {}

  @Get()
  @ApiOperation({ summary: 'Get all parent' })
  async findAll() {
    return this.parentService.findAll();
  }

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // // @ApiBody({
  // //   schema: {
  // //     type: 'object',
  // //     properties: {
  // //       fullName: { type: 'string', example: 'Phụ huynh A' },
  // //       phoneNumber: { type: 'string', example: '0972899999' },
  // //       email: { type: 'string', example: 'A123@gmail.com' },
  // //       address: { type: 'string', example: 'Địa chỉ A' },
  // //       userId: { type: 'number', example: 1 },
  // //       file: {
  // //         type: 'string',
  // //         format: 'binary',
  // //       },
  // //       required: ['fullName', 'phoneNumber', 'email', 'address', 'userId'],
  // //     },
  // //   },
  // // })
  // @ApiBody({
  //   schema: {
  //     type: 'object',
  //     properties: {
  //       fullName: { type: 'string', example: 'Phụ huynh A' },
  //       phoneNumber: { type: 'string', example: '0972899999' },
  //       email: { type: 'string', example: 'A123@gmail.com' },
  //       address: { type: 'string', example: 'Địa chỉ A' },
  //       userId: { type: 'number', example: 1 },
  //       file: { type: 'string', format: 'binary' },
  //     },
  //     required: ['fullName', 'phoneNumber', 'userId'], // ✅ đúng: nằm trong schema
  //   },
  // })
  // @ApiOperation({ summary: 'Add Parent' })
  // async create(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Body() createParent: CreateParentDto,
  // ) {
  //   return this.parentService.create(createParent, file);
  // }
  @Post()
  @UseInterceptors(FileInterceptor('avatar')) // Xử lý file upload từ trường 'avatar'
  @ApiOperation({ summary: 'Tạo mới một Parent với avatar tùy chọn' })
  @ApiConsumes('multipart/form-data') // Chỉ định yêu cầu là multipart/form-data
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        avatar: {
          type: 'string',
          format: 'binary', // Định nghĩa trường file upload
        },
        userId: { type: 'number' },
        fullName: { type: 'string' },
        phoneNumber: { type: 'string' },
        email: { type: 'string' },
        address: { type: 'string' },
      },
      required: ['userId', 'fullName'], // Các trường bắt buộc
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createParentDto: CreateParentDto,
  ): Promise<Parent> {
    return this.parentService.create(createParentDto, file);
  }
}
