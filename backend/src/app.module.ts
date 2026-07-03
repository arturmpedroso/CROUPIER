import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CardsModule } from './cards/cards.module';
import { PrismaService } from './prisma.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [CardsModule, UsersModule, AuthModule],
  controllers: [AppController],
  providers: [AppService,PrismaService],
})

export class AppModule {}


