import { IsEmail, IsNotEmpty, IsString, MinLength, Matches } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'O nome de usuário é obrigatório.' })
  @IsString({ message: 'O nome deve ser um texto válido.' })
  name!: string;
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  @IsEmail({}, { message: 'Por favor, insira um e-mail válido.' })
  email!: string;

  @IsNotEmpty({ message: 'A senha é obrigatória.' })
  @MinLength(8, { message: 'A senha deve conter no mínimo 8 caracteres.' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)/, {
    message: 'A senha precisa conter pelo menos uma letra e um número.',
  })
  password!: string;
}