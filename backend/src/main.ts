import * as dotenv from 'dotenv';
// Carrega o arquivo .env imediatamente para a memória do Node.js
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(4000);
  
  console.log(`back do CROUPIER rodando com sucesso em http://localhost:4000`);
}
bootstrap();