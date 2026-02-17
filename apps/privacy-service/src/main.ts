import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: parseInt(process.env.PRIVACY_GRPC_PORT || '50052', 10),
    },
  });
  await app.listen();
  console.log('Privacy Service is running on port', process.env.PRIVACY_GRPC_PORT || 50052);
}
bootstrap();
