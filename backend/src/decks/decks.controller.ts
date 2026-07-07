import { Controller, Post, Get, Patch, Delete, Body, Param, Request, UseGuards, ParseIntPipe } from '@nestjs/common';
import { DecksService } from './decks.service';
import { AuthGuard } from '../auth/auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Decks (Baralhos)')
@ApiBearerAuth()
@Controller('decks')
@UseGuards(AuthGuard)
export class DecksController {
  constructor(private readonly decksService: DecksService) {}

  @Post()
  @ApiOperation({ summary: 'Cria um novo baralho dentro de um grupo' })
  @ApiResponse({ status: 201, description: 'Baralho criado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido. Usuário sem permissão de edição.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Membros Superiores', description: 'Nome do baralho' },
        groupId: { type: 'number', example: 1, description: 'ID do grupo ao qual este baralho pertence' }
      },
      required: ['name', 'groupId']
    }
  })
  async create(@Request() req: any, @Body() body: { name: string; groupId: number }) {
    return this.decksService.create(req.user.sub, body);
  }

  @Get('group/:groupId')
  @ApiOperation({ summary: 'Lista todos os baralhos de um determinado grupo' })
  @ApiParam({ name: 'groupId', description: 'ID do grupo', example: 1 })
  @ApiResponse({ status: 200, description: 'Lista de baralhos retornada com sucesso.' })
  async findAllByGroup(@Request() req: any, @Param('groupId', ParseIntPipe) groupId: number) {
    return this.decksService.findAllByGroup(req.user.sub, groupId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza o nome de um baralho existente' })
  @ApiParam({ name: 'id', description: 'ID numérico do baralho', example: 1 })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Membros Inferiores (Revisado)' }
      },
      required: ['name']
    }
  })
  async update(
    @Request() req: any,
    @Param('id', ParseIntPipe) deckId: number,
    @Body('name') name: string
  ) {
    return this.decksService.update(req.user.sub, deckId, name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um baralho e todos os seus flashcards' })
  @ApiParam({ name: 'id', description: 'ID numérico do baralho', example: 1 })
  @ApiResponse({ status: 200, description: 'Baralho deletado com sucesso.' })
  async remove(@Request() req: any, @Param('id', ParseIntPipe) deckId: number) {
    return this.decksService.remove(req.user.sub, deckId);
  }
  @Get(':id')
  @ApiOperation({ summary: 'Busca os detalhes de um baralho específico' })
  @ApiParam({ name: 'id', description: 'ID numérico do baralho', example: 1 })
  @ApiResponse({ status: 200, description: 'Detalhes do baralho retornados com sucesso.' })
  @ApiResponse({ status: 404, description: 'Baralho não encontrado.' })
  async findOne(@Request() req: any, @Param('id', ParseIntPipe) deckId: number) {
    return this.decksService.findOne(req.user.sub, deckId);
  }
}