import { Controller, Post, Get, Patch, Delete, Body, Request, UseGuards, Param, ParseIntPipe } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { AuthGuard } from '../auth/auth.guard';

import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';

@ApiTags('Groups (Grupos de Baralhos)') // Categoria no painel do Swagger
@ApiBearerAuth()                        
@Controller('groups')
@UseGuards(AuthGuard) 
export class GroupsController {
  constructor(private groupsService: GroupsService) {}

  @Post()
  @ApiOperation({ summary: 'Cria un novo grupo de baralhos para o usuário logado' })
  @ApiResponse({ status: 201, description: 'Grupo criado com sucesso!' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token ausente ou inválido.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Anatomia Humana - Semestre 1', description: 'Nome do grupo' },
        description: { type: 'string', example: 'Grupo focado em decorar os ossos e músculos', description: 'Descrição opcional' },
        isPrivate: { type: 'boolean', example: false, description: 'Se o grupo é privado ou público' }
      },
      required: ['name']
    }
  })
  async create(@Request() req: any, @Body() body: { name: string; description?: string; isPrivate?: boolean }) {
    return this.groupsService.create(req.user.sub, body);
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os grupos acessíveis pelo usuário (os que ele criou + compartilhados com ele)' })
  @ApiResponse({ status: 200, description: 'Lista de grupos retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado.' })
  async findAll(@Request() req: any) {
    return this.groupsService.findAllAccessible(req.user.sub);
  }

  @Post(':id/share')
  @ApiOperation({ summary: 'Compartilha um grupo com outro usuário através do username' })
  @ApiParam({ name: 'id', description: 'ID numérico do grupo que será compartilhado', example: 1 })
  @ApiResponse({ status: 201, description: 'Grupo compartilhado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido. Apenas o dono do grupo pode compartilhá-lo.' })
  @ApiResponse({ status: 404, description: 'Grupo ou usuário alvo não encontrado.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        targetUsername: { type: 'string', example: 'arturpedroso', description: 'O username do usuário que receberá o acesso' },
        canEdit: { type: 'boolean', example: false, description: 'Se o usuário que recebeu o acesso poderá editar os flashcards' }
      },
      required: ['targetUsername', 'canEdit']
    }
  })
  async share(
    @Request() req: any,
    @Param('id', ParseIntPipe) groupId: number,
    @Body() body: { targetUsername: string; canEdit: boolean }
  ) {
    return this.groupsService.shareGroup(req.user.sub, groupId, body.targetUsername, body.canEdit);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza as informações de uma mesa/grupo existente' })
  @ApiParam({ name: 'id', description: 'ID numérico do grupo que será editado', example: 1 })
  @ApiResponse({ status: 200, description: 'Grupo atualizado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido. Apenas o dono do grupo pode editá-lo.' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado.' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Anatomia Humana - Semestre 2', description: 'Novo nome do grupo' },
        description: { type: 'string', example: 'Focado agora em neuroanatomia', description: 'Nova descrição' },
        isPrivate: { type: 'boolean', example: true, description: 'Atualização de privacidade' }
      }
    }
  })
  async update(
    @Request() req: any,
    @Param('id', ParseIntPipe) groupId: number,
    @Body() body: { name?: string; description?: string; isPrivate?: boolean }
  ) {
    // IMPORTANTE: Passe o ID do usuário para o service garantir que ele é o dono do grupo!
    return this.groupsService.update(req.user.sub, groupId, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Recolhe as apostas: deleta um grupo e todos os seus baralhos' })
  @ApiParam({ name: 'id', description: 'ID numérico do grupo que será deletado', example: 1 })
  @ApiResponse({ status: 200, description: 'Grupo deletado com sucesso.' })
  @ApiResponse({ status: 403, description: 'Proibido. Apenas o dono pode deletar o grupo.' })
  @ApiResponse({ status: 404, description: 'Grupo não encontrado.' })
  async remove(
    @Request() req: any,
    @Param('id', ParseIntPipe) groupId: number
  ) {
    // IMPORTANTE: Passe o ID do usuário para validação de posse no service
    return this.groupsService.delete(req.user.sub, groupId);
  }
}
