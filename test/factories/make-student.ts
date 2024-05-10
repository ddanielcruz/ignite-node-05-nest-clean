import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'

export function makeStudent(
  override?: Partial<StudentProps & { id: UniqueEntityId | string }>,
): Student {
  return new Student(
    {
      email: faker.internet.email(),
      name: faker.person.fullName(),
      passwordHash: `hashed:${faker.internet.password()}`,
      ...override,
    },
    override?.id,
  )
}
