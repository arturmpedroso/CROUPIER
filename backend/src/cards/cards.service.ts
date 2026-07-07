import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CardsService {
  constructor(private prisma: PrismaService) {}

  // Função auxiliar para validar permissões
  private async validateDeckAccess(userId: number, deckId: number) {
    const deck = await this.prisma.deck.findUnique({
      where: { id: deckId },
      include: {
        group: {
          include: { shares: true }
        }
      }
    });

    if (!deck) {
      throw new NotFoundException('Baralho não encontrado.');
    }

    const isOwner = deck.group.ownerId === userId;
    const hasEditShare = deck.group.shares.some(share => share.userId === userId && share.canEdit);

    if (!isOwner && !hasEditShare) {
      throw new ForbiddenException('Você não tem permissão para alterar as cartas desta mesa.');
    }

    return deck;
  }

  // Cria a carta
  async createCard(userId: number, dto: { name?: string; question: string; answer: string; deckId: number }) {
    await this.validateDeckAccess(userId, dto.deckId);

    return this.prisma.flashcard.create({
      data: {
        name: dto.name,
        question: dto.question,
        answer: dto.answer,
        deckId: dto.deckId
      }
    });
  }

  // Retorna cartas do baralho
  async getCardsByDeck(deckId: number) {
    return this.prisma.flashcard.findMany({
      where: { deckId },
      orderBy: { createdAt: 'asc' } // Mantém a ordem em que foram criadas
    });
  }

  // Atualiza carta
  async updateCard(userId: number, cardId: number, dto: { name?: string; question?: string; answer?: string }) {
    const card = await this.prisma.flashcard.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Carta não encontrada.');

    await this.validateDeckAccess(userId, card.deckId);

    return this.prisma.flashcard.update({
      where: { id: cardId },
      data: dto
    });
  }

  // Deleta carta
  async deleteCard(userId: number, cardId: number) {
    const card = await this.prisma.flashcard.findUnique({ where: { id: cardId } });
    if (!card) throw new NotFoundException('Carta não encontrada.');

    await this.validateDeckAccess(userId, card.deckId);

    return this.prisma.flashcard.delete({
      where: { id: cardId }
    });
  }
}