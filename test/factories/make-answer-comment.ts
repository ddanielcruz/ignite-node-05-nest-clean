import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  AnswerComment,
  AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment'
import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

type AnswerCommentFactoryProps = Partial<AnswerCommentProps> & {
  id?: UniqueEntityId
}

export function makeAnswerComment(override?: AnswerCommentFactoryProps) {
  return new AnswerComment(
    {
      authorId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      content: faker.lorem.text(),
      ...override,
    },
    override?.id,
  )
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async make(override?: AnswerCommentFactoryProps) {
    const comment = makeAnswerComment(override)
    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(comment),
    })

    return comment
  }
}
