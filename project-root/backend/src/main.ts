import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  //bật validation toàn cục
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // chỉ nhận field trong dto
      forbidNonWhitelisted: true, // nếu gửi field thừa thì báo lỗi
      transform: true, //tự động chuyển kiểu dữ liệu (string ->numberr)
    }),
  );

  // Cấu hình static assets (nếu dùng uploads)
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  //Cấu hình swagger
  const config = new DocumentBuilder()
    .setTitle('Web điểm danh')
    .setDescription('API test web')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('binh', app, document);

  await app.listen(process.env.PORT ?? 2411);
  console.log('🚀 👻 -> Bình HeHeHe EAT -> PORT:', process.env.PORT);
}
bootstrap();
