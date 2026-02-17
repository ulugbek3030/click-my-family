import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from '@my-family/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api/admin');
  app.useGlobalPipes(GlobalValidationPipe);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My Family - Admin API')
    .setDescription('Admin panel backend for My Family module')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/admin/docs', app, document);

  const port = process.env.ADMIN_PORT || 3001;
  await app.listen(port);
  console.log(`Admin Service running on port ${port}`);
}
bootstrap();
