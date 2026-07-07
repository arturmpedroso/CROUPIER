import { IsNotEmpty, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CardResultDto {
  @ApiProperty({
    description: 'ID único da carta respondida',
    example: 12,
    required: true,
  })
  @IsNotEmpty({ message: 'O ID da carta (flashcardId) é obrigatório.' })
  @IsNumber({}, { message: 'O ID da carta deve ser um número.' })
  flashcardId!: number;

  @ApiProperty({
    description: 'Define se o jogador acertou ou errou a carta',
    example: true,
    required: true,
  })
  @IsNotEmpty({ message: 'O resultado da carta (isCorrect) é obrigatório.' })
  @IsBoolean({ message: 'O resultado deve ser um valor booleano (true ou false).' })
  isCorrect!: boolean;
}

export class SaveStudyDto {
  @ApiProperty({
    description: 'ID numérico do baralho jogado nesta partida',
    example: 6,
    required: true,
  })
  @IsNotEmpty({ message: 'O ID do baralho (deckId) é obrigatório.' })
  @IsNumber({}, { message: 'O ID do baralho deve ser um número.' })
  deckId!: number;

  @ApiProperty({
    description: 'Lista com o desempenho individual de cada carta na rodada',
    type: () => CardResultDto,
    isArray: true,
    required: true,
  })
  @IsNotEmpty({ message: 'A lista de resultados é obrigatória.' })
  @IsArray({ message: 'Os resultados devem ser enviados em formato de lista (array).' })
  @ValidateNested({ each: true })
  @Type(() => CardResultDto)
  results!: CardResultDto[];
}