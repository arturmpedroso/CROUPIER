import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SaveStudyDto } from './dto/save-study.dto';

@Injectable()
export class StudyService {
  constructor(private prisma: PrismaService) {}

  private async validateDeckAccess(userId: number, deckId: number) {
    const deck = await this.prisma.deck.findUnique({
      where: { id: deckId },
      include: {
        group: {
          include: {
            shares: {
              where: { userId },
            },
          },
        },
      },
    });

    if (!deck) {
      throw new NotFoundException('Baralho nao encontrado.');
    }

    const isOwner = deck.group.ownerId === userId;
    const isSharedWithUser = deck.group.shares.length > 0;

    if (!isOwner && !isSharedWithUser) {
      throw new ForbiddenException('Voce nao tem acesso a este baralho.');
    }

    return deck;
  }

  async saveSession(userId: number, dto: SaveStudyDto) {
    await this.validateDeckAccess(userId, dto.deckId);

    if (!dto.results || dto.results.length === 0) {
      throw new BadRequestException('Nenhum resultado foi enviado.');
    }

    for (const result of dto.results) {
      const flashcard = await this.prisma.flashcard.findFirst({
        where: {
          id: result.flashcardId,
          deckId: dto.deckId,
        },
      });

      if (!flashcard) {
        throw new BadRequestException('Carta invalida para este baralho.');
      }

      await this.prisma.flashcard.update({
        where: { id: result.flashcardId },
        data: {
          totalCorrect: result.isCorrect ? { increment: 1 } : undefined,
          totalWrong: result.isCorrect ? undefined : { increment: 1 },
        },
      });

      await this.prisma.userScore.upsert({
        where: {
          flashcardId_userId: {
            flashcardId: result.flashcardId,
            userId,
          },
        },
        update: {
          correct: result.isCorrect ? { increment: 1 } : undefined,
          wrong: result.isCorrect ? undefined : { increment: 1 },
        },
        create: {
          flashcardId: result.flashcardId,
          userId,
          correct: result.isCorrect ? 1 : 0,
          wrong: result.isCorrect ? 0 : 1,
        },
      });
    }

    return {
      success: true,
      message: 'Resultados salvos com sucesso!',
    };
  }
}
