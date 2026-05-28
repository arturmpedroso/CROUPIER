import * as dotenv from 'dotenv';
// Carrega o arquivo .env imediatamente para a memória do Node.js
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();