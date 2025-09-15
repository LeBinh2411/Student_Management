import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageValidationPige implements PipeTransform {
  private readonly maxSize = 5 * 1024 * 1024; // 5MB
  private readonly fileTypes = /(jpg|jpeg|png)$/;

  transform(file: Express.Multer.File) {
    if (!file) return file; // cho phép không upload

    // ✅ Check dung lượng
    if (file.size > this.maxSize) {
      throw new BadRequestException(`Ảnh quá lớn! Tối đa 5MB`);
    }

    // ✅ Check định dạng
    if (!this.fileTypes.test(file.originalname.toLowerCase())) {
      throw new BadRequestException(`Chỉ chấp nhận: jpg, jpeg, png`);
    }

    return file;
  }
}
