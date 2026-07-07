import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { StudyService } from './study.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';

@ApiTags('Study (Mesa de Estudos)') // Categoria no painel do Swagger
@ApiBearerAuth()
@Controller('study')
@UseGuards(AuthGuard)
export class StudyController {
  constructor(private studyService: StudyService) {}

  @Post()
  @ApiOperation({ summary: 'Registra o lucro/prejuízo (acertos e erros) ao finalizar uma rodada de estudos' })
  @ApiResponse({ status: 201, description: 'Estatísticas da partida salvas com sucesso nas tabelas!' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token ausente ou inválido.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        deckId: { 
          type: 'number', 
          example: 6, 
          description: 'ID do baralho que acabou de ser jogado' 
        },
        results: {
          type: 'array',
          description: 'Lista contendo o desempenho individual de cada carta respondida',
          items: {
            type: 'object',
            properties: {
              flashcardId: { type: 'number', example: 12, description: 'ID da carta' },
              isCorrect: { type: 'boolean', example: true, description: 'Se o usuário acertou a alternativa' }
            },
            required: ['flashcardId', 'isCorrect']
          }
        }
      },
      required: ['deckId', 'results']
    }
  })
  async saveStudySession(
    @Request() req: any, 
    @Body() body: { deckId: number; results: { flashcardId: number; isCorrect: boolean }[] }
  ) {
    // req.user.sub contém o ID numérico/UUID do usuário logado vindo do seu AuthGuard
    return this.studyService.saveSession(req.user.sub, body);
  }
}