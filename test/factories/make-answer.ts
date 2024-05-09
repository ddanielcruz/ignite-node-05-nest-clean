import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export function makeAnswer(
  override?: Partial<AnswerProps & { id: UniqueEntityId | string }>,
): Answer {
  return new Answer(
    {
      authorId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      content: faker.lorem.paragraph(),
      ...override,
    },
    override?.id,
  )
}
