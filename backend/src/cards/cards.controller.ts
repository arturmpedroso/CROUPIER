import { Controller, Post, Get, Patch, Delete, Body, Request, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { CardsService } from './cards.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Cards (Flashcards)') // Categoria no painel do Swagger
@ApiBearerAuth()
@Controller('cards')
@UseGuards(AuthGuard)
export class CardsController {
  constructor(private cardsService: CardsService) {}

  @Post()
  @ApiOperation({ summary: 'Distribui uma nova carta (flashcard) na mesa (baralho)' })
  @ApiResponse({ status: 201, description: 'Carta criada com sucesso!' })
  @ApiResponse({ status: 403, description: 'Proibido. Usuário sem permissão para editar este baralho.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Artéria Aorta', description: 'Nome ou título opcional da carta' },
        question: { type: 'string', example: 'Qual é a maior artéria do corpo humano?', description: 'A frente do flashcard' },
        answer: { type: 'string', example: 'Artéria Aorta', description: 'O verso do flashcard' },
        deckId: { type: 'number', example: 1, description: 'ID numérico do baralho ao qual a carta pertence' }
      },
      required: ['question', 'answer', 'deckId']
    }
  })
  async create(
    @Request() req: any,
    @Body() body: { name?: string; question: string; answer: string; deckId: number }
  ) {
    return this.cardsService.createCard(req.user.sub, body);
  }

  @Get('deck/:deckId')
  @ApiOperation({ summary: 'Lista todas as cartas de um baralho específico' })
  @ApiParam({ name: 'deckId', description: 'ID numérico do baralho', example: 1 })
  @ApiResponse({ status: 200, description: 'Cartas retornadas com sucesso.' })
  async getByDeck(@Param('deckId', ParseIntPipe) deckId: number) {
    return this.cardsService.getCardsByDeck(deckId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza o conteúdo de uma carta existente' })
  @ApiParam({ name: 'id', description: 'ID numérico da carta que será editada', example: 1 })
  @ApiResponse({ status: 200, description: 'Carta atualizada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido. Sem permissão de edição.' })
  @ApiResponse({ status: 404, description: 'Carta não encontrada.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Artéria Aorta (Atualizado)' },
        question: { type: 'string', example: 'Nova pergunta da carta?' },
        answer: { type: 'string', example: 'Nova resposta' }
      }
    }
  })
  async update(
    @Request() req: any,
    @Param('id', ParseIntPipe) cardId: number,
    @Body() body: { name?: string; question?: string; answer?: string }
  ) {
    return this.cardsService.updateCard(req.user.sub, cardId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Recolhe a carta: deleta um flashcard específico' })
  @ApiParam({ name: 'id', description: 'ID numérico da carta que será deletada', example: 1 })
  @ApiResponse({ status: 200, description: 'Carta deletada com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido. Sem permissão de exclusão.' })
  @ApiResponse({ status: 404, description: 'Carta não encontrada.' })
  async remove(
    @Request() req: any,
    @Param('id', ParseIntPipe) cardId: number
  ) {
    return this.cardsService.deleteCard(req.user.sub, cardId);
  }
}