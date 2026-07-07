import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class DecksService {
  constructor(private prisma: PrismaService) {}

  // Função auxiliar privada para checar permissões de forma reaproveitável
  private async validateGroupAccess(userId: number, groupId: number, requiresEdit: boolean) {
    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: {
        shares: {
          where: { userId: userId }
        }
      }
    });

    if (!group) throw new NotFoundException('Grupo não encontrado.');

    // Se é o dono, tem acesso total
    if (group.ownerId === userId) return true;

    // Se não é o dono, checa se tem compartilhamento
    const share = group.shares[0];
    if (!share) throw new ForbiddenException('Você não tem acesso a este grupo.');

    // Se a ação exige edição e o usuário não tem a flag canEdit, barra.
    if (requiresEdit && !share.canEdit) {
      throw new ForbiddenException('Você tem acesso de leitura, mas não tem permissão para editar/criar baralhos neste grupo.');
    }

    return true;
  }

  // Cria um novo baralho
  async create(userId: number, dto: { name: string; groupId: number }) {
    await this.validateGroupAccess(userId, dto.groupId, true);

    return this.prisma.deck.create({
      data: {
        name: dto.name,
        groupId: dto.groupId,
      },
    });
  }

  // Lista os baralhos de um grupo específico
  async findAllByGroup(userId: number, groupId: number) {
    await this.validateGroupAccess(userId, groupId, false);

    return this.prisma.deck.findMany({
      where: { groupId },
      include: {
        _count: { select: { flashcards: true } } // Já traz a quantidade de cartas no baralho!
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // Atualiza um baralho (renomear)
  async update(userId: number, deckId: number, name: string) {
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId } });
    if (!deck) throw new NotFoundException('Baralho não encontrado.');

    await this.validateGroupAccess(userId, deck.groupId, true);

    return this.prisma.deck.update({
      where: { id: deckId },
      data: { name },
    });
  }

  // Deleta um baralho
  async remove(userId: number, deckId: number) {
    const deck = await this.prisma.deck.findUnique({ where: { id: deckId } });
    if (!deck) throw new NotFoundException('Baralho não encontrado.');

    await this.validateGroupAccess(userId, deck.groupId, true);

    return this.prisma.deck.delete({
      where: { id: deckId },
    });
  }

  // Busca os detalhes de um baralho específico
  async findOne(userId: number, deckId: number) {
    const deck = await this.prisma.deck.findUnique({ 
      where: { id: deckId },
      include: {
        _count: { select: { flashcards: true } } 
      }
    });
    
    if (!deck) throw new NotFoundException('Baralho não encontrado.');

    // Verifica se o usuário tem pelo menos acesso de leitura ao grupo da mesa
    await this.validateGroupAccess(userId, deck.groupId, false);

    return deck;
  }
}