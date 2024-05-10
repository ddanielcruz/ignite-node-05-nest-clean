import { Answer as PrismaAnswer, Prisma } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class PrismaAnswerMapper {
  static toDomain(answer: PrismaAnswer): Answer {
    return new Answer(
      {
        authorId: new UniqueEntityId(answer.authorId),
        questionId: new UniqueEntityId(answer.questionId),
        content: answer.content,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
      },
      answer.id,
    )
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toString(),
      authorId: answer.authorId.value,
      questionId: answer.questionId.value,
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    }
  }
}
