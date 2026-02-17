import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { GlobalValidationPipe } from '@my-family/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors();
  app.setGlobalPrefix('v1/family');
  app.useGlobalPipes(GlobalValidationPipe);

  const swaggerConfig = new DocumentBuilder()
    .setTitle('My Family API')
    .setDescription('API for the My Family module in CLICK ecosystem')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('v1/family/docs', app, document);

  const port = process.env.API_PORT || 3000;
  await app.listen(port);
  console.log(`API Gateway running on port ${port}`);
  console.log(`Swagger docs at http://localhost:${port}/v1/family/docs`);
}
bootstrap();
