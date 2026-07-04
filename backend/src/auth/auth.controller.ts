import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';

import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth (Autenticação)') // Cria a aba de Autenticação no painel
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Realiza a autenticação do usuário (Login)' })
  @ApiResponse({ 
    status: 200, 
    description: 'Login efetuado com sucesso. Retorna o token JWT e os dados do usuário.' 
  })
  @ApiResponse({ status: 401, description: 'Credenciais inválidas (E-mail ou senha incorretos).' })
  // Avisa ao Swagger quais campos ele deve desenhar na caixinha de testes
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', example: 'artur@croupier.com', description: 'E-mail do usuário cadastrado' },
        password: { type: 'string', example: 'SenhaMesa123', description: 'Senha de acesso' }
      },
      required: ['email', 'password']
    }
  })
  async login(@Body() loginDto: any) {
    return this.authService.login(loginDto);
  }
}