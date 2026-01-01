import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from 'config/envs';
import { Logger } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('PacientesMS-Main');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: { port: envs.PORT },
    },
  );

  await app.listen();

  console.log(`Application is running on: http://localhost:${envs.PORT}`);
}
bootstrap();
