import { Prisma, User } from '@prisma/client'

import { Student } from '@/domain/forum/enterprise/entities/student'

export class PrismaStudentMapper {
  static toDomain(user: User): Student {
    return new Student(
      {
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
        createdAt: user.createdAt,
      },
      user.id,
    )
  }

  static toPrisma(student: Student): Prisma.UserUncheckedCreateInput {
    return {
      id: student.id.toString(),
      email: student.email,
      name: student.name,
      passwordHash: student.passwordHash,
      role: 'STUDENT',
      createdAt: student.createdAt,
    }
  }
}
