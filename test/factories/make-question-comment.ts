import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  QuestionComment,
  QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment'
import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

type QuestionCommentFactoryProps = Partial<QuestionCommentProps> & {
  id?: UniqueEntityId
}

export function makeQuestionComment(override?: QuestionCommentFactoryProps) {
  return new QuestionComment(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    override?.id,
  )
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async make(override?: QuestionCommentFactoryProps) {
    const comment = makeQuestionComment(override)
    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(comment),
    })

    return comment
  }
}
