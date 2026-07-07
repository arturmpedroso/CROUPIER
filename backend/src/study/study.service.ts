import { Injectable } from '@nestjs/common';
import { SaveStudyDto } from './dto/save-study.dto';
import { PrismaService } from '../prisma.service';

@Injectable()
export class StudyService {
  constructor(private prisma: PrismaService) {}

  async saveSession(userId: number, data: SaveStudyDto) {
    // Usamos uma transação para garantir que, se der erro em uma carta, não quebra o banco
    const operations = data.results.map((result) => {
      
      // 1. Prepara a atualização GLOBAL do Flashcard
      const updateGlobal = this.prisma.flashcard.update({
        where: { id: result.flashcardId },
        data: {
          quantAcertos: result.isCorrect ? { increment: 1 } : undefined,
          quantErros: !result.isCorrect ? { increment: 1 } : undefined,
        } as any,
      });

      // 2. Prepara a atualização INDIVIDUAL (Relacionamento UserFlashcard)
      // Ajuste os nomes das tabelas e campos conforme o seu Schema exato
      const updateUserRelation = (this.prisma as any).userFlashcard.upsert({
        where: {
          userId_flashcardId: { // Ajuste se o nome da chave composta for diferente
            userId: userId,
            flashcardId: result.flashcardId,
          },
        },
        update: {
          quantAcertos: result.isCorrect ? { increment: 1 } : undefined,
          quantErros: !result.isCorrect ? { increment: 1 } : undefined,
        },
        create: {
          userId: userId,
          flashcardId: result.flashcardId,
          quantAcertos: result.isCorrect ? 1 : 0,
          quantErros: !result.isCorrect ? 1 : 0,
        },
      });

      return [updateGlobal, updateUserRelation];
    });

    // Roda todas as atualizações de uma vez no banco
    await this.prisma.$transaction(operations.flat());

    return { message: 'Partida salva com sucesso!' };
  }
}