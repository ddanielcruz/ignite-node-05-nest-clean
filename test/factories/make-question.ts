import { faker } from '@faker-js/faker'

import { Timestamps } from '@/core/entities/timestamps'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Question,
  QuestionProps,
} from '@/domain/forum/enterprise/entities/question'

export function makeQuestion(
  override?: Partial<
    QuestionProps & Timestamps & { id: UniqueEntityId | string }
  >,
): Question {
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
