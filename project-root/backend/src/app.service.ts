import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Xin chào dự án web quản lý học sinh đang được triển khai';
  }
}
