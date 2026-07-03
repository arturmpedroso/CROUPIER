import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from '../prisma.service';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'MINHA_CHAVE_SECRETA_DO_CASSINO_123', 
      signOptions: { expiresIn: '7d' }, 
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PrismaService],
})
export class AuthModule {}