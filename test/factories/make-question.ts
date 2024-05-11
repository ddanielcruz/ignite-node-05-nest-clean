import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { Timestamps } from '@/core/entities/timestamps'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

type QuestionFactoryProps = Partial<
  QuestionProps & Timestamps & { id: UniqueEntityId | string }
>

export function makeQuestion(override?: QuestionFactoryProps): Question {
  return new Question(
    {
      authorId: new UniqueEntityId(),
      title: faker.lorem.sentence(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    override?.id,
  )
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prisma: PrismaService) {}

  async make(override?: QuestionFactoryProps) {
    const question = makeQuestion(override)
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    return question
  }
}
