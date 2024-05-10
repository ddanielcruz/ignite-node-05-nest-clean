import { Prisma, Question as PrismaQuestion } from '@prisma/client'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

export class PrismaQuestionMapper {
  static toDomain(question: PrismaQuestion): Question {
    return new Question(
      {
        authorId: new UniqueEntityId(question.authorId),
        bestAnswerId: question.bestAnswerId
          ? new UniqueEntityId(question.bestAnswerId)
          : null,
        title: question.title,
        content: question.content,
        slug: Slug.create(question.slug),
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
      question.id,
    )
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toString(),
      authorId: question.authorId.toString(),
      bestAnswerId: question.bestAnswerId?.toString(),
      title: question.title,
      content: question.content,
      slug: question.slug.value,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    }
  }
}
