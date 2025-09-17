import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
// PipeTransform là interface của NestJS, yêu cầu phương thức transform để Giúp kiểm tra, biến đổi, hoặc validate dữ liệu (như file, body, params) theo logic tùy chỉnh.
// implements, cam kết phải có phương thức transform
export class ImageValidationPige implements PipeTransform {
  private readonly maxSize = 5 * 1024 * 1024; // Khai báo hằng số maxSize với giá trị 5MB (5 * 1024 * 1024 bytes)
  private readonly fileTypes = /(jpg|jpeg|png)$/; // Khai báo hằng số fileTypes là biểu thức chính quy (RegExp) để kiểm tra định dạng file

  //transform phương thức của PipeTransform, nhận file từ Express.Multer.File, và sử lý trc khi truyền vào controller
  transform(file: Express.Multer.File) {
    if (!file) return file; // Nếu k có file(null hoặc undefined), trả về nguyên vẹn không gây lỗi
    // cho phép không upload

    // ✅ Check dung lượng
    // so sánh dung lượng file(file.size, đơn vị byte) với maxSize (5MB)
    //Nếu lớn hơn ném ngoại lệ cho client
    if (file.size > this.maxSize) {
      throw new BadRequestException(`Ảnh quá lớn! Tối đa 5MB`);
    }

    // ✅ Check định dạng
    // Sử dụng fileTypes.test để kiểm tra định dạng file dựa trên file gốc (file.originalname), toLowerCase() chuyển về chữ thường để không phân biệt hoa thường
    // phương thức test() của RegExp so sánh chuỗi đầu vào ( ở đây là file.originalname.toLowerCase())
    if (!this.fileTypes.test(file.originalname.toLowerCase())) {
      throw new BadRequestException(`Chỉ chấp nhận: jpg, jpeg, png`);
    }

    return file;
    //trả về file cho phép tiếp tục sử lý trong controller
  }
}
