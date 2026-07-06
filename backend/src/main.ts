import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Bloqueia e limpa campos estranhos enviados pelo front que não estão no DTO
    forbidNonWhitelisted: true, // Dispara erro se tentarem enviar campos não permitidos
  }));

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
// Swagger
const config = new DocumentBuilder()
    .setTitle('Croupier API')
    .setDescription('Documentação dos endpoints do ecossistema CROUPIER')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(4000);
}
bootstrap();