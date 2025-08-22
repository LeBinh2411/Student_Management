import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

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
