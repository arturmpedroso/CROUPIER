import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { randomBytes } from 'crypto'; // <-- Import do crypto do node

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) {}

  // Cria um grupo
  async create(userId: number, dto: { name: string; description?: string; isPrivate?: boolean }) {
    const generatedCode = randomBytes(3).toString('hex').toUpperCase(); //gera o código random de compartilhamento
    return this.prisma.group.create({
      data: {
        name: dto.name,
        description: dto.description,
        isPrivate: dto.isPrivate ?? false,
        shareCode: generatedCode,
        ownerId: userId,
      },
    });
  }

  //Lista todos os grupos acessíveis por um usuário
  async findAllAccessible(userId: number) {
    return this.prisma.group.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { shares: { some: { userId: userId } } }
        ]
      },
      include: {
        owner: { select: { name: true, username: true } },
        shares: { include: { user: { select: { username: true } } } },
        _count: { select: { decks: true } } 
      },
    });
  }

  // Usuário entra em um grupo pelo código de compartilhamento do grupo
  async joinByCode(userId: number, shareCode: string) {
    // Busca o grupo que tem esse código
    const group = await this.prisma.group.findUnique({
      where: { shareCode }
    });

    if (!group) {
      throw new NotFoundException('Código de convite inválido ou expirado.');
    }

    if (group.ownerId === userId) {
      throw new BadRequestException('Você já é o dono deste grupo.');
    }

    // Registra o usuário no grupo (se ele já estiver, o upsert apenas ignora)
    return this.prisma.groupShare.upsert({
      where: {
        groupId_userId: { groupId: group.id, userId }
      },
      update: {}, // Não atualiza nada se já existir
      create: {
        groupId: group.id,
        userId,
        canEdit: false // Visitantes via link começam apenas como leitores por padrão
      }
    });
  }

  // Compartilhar um grupo com outro usuário usando o username
  async shareGroup(ownerId: number, groupId: number, targetUsername: string, canEdit: boolean) {
    // Valida se o grupo existe e se quem está compartilhando é realmente o dono
    const group = await this.prisma.group.findUnique({ where: { id: groupId } });
    
    if (!group) throw new NotFoundException('Grupo não encontrado.');
    if (group.ownerId !== ownerId) throw new ForbiddenException('Apenas o dono pode compartilhar este grupo.');

    // Busca o usuário pelo username
    const targetUser = await this.prisma.user.findUnique({ where: { username: targetUsername } });
    if (!targetUser) throw new NotFoundException('Usuário alvo não encontrado.');
    if (targetUser.id === ownerId) throw new BadRequestException('Você não pode compartilhar um grupo com você mesmo.');

    // Registra o compartilhamento na tabela N:N
    return this.prisma.groupShare.upsert({
      where: {
        groupId_userId: { groupId, userId: targetUser.id }
      },
      update: { canEdit },
      create: {
        groupId,
        userId: targetUser.id,
        canEdit
      }
    });
  }
}