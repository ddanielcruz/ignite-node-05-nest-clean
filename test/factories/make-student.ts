import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student'
import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

export type StudentFactoryProps = Partial<
  StudentProps & { id: UniqueEntityId | string }
>

export function makeStudent(override?: StudentFactoryProps): Student {
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

@Injectable()
export class StudentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async make(override?: StudentFactoryProps) {
    const student = makeStudent(override)
    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })

    return student
  }
}
