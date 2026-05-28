import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { PrismaService } from './prisma.service';

@Module({
  imports: [CardsModule],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}


