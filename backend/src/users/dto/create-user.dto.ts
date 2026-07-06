import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger'; // <- Importado

export class CreateUserDto {
  @ApiProperty({
    description: 'Nome completo do usuário/jogador',
    example: 'Artur Pedroso',
    required: true,
  })
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório.' })
  @IsString({ message: 'O nome deve ser um texto válido.' })
  name!: string;

  @ApiProperty({
    description: 'E-mail exclusivo para login e notificações',
    example: 'artur@croupier.com',
    required: true,
  })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email!: string;

  @ApiProperty({
    description: 'Nome de usuário único para compor a URL dinâmica da mesa',
    example: 'arturpedroso',
    required: true,
  })
  @IsString()
  @IsNotEmpty({ message: 'O username é obrigatório.' })
  username!: string;

  @ApiProperty({
    description: 'Senha de acesso (mínimo 8 caracteres, contendo pelo menos uma letra e um número)',
    example: 'SenhaMesa123',
    required: true,
    minLength: 8,
  })
  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'A senha precisa conter pelo menos uma letra e um número.',
  })
  password!: string;
}