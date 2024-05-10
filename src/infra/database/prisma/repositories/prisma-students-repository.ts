import { Injectable } from '@nestjs/common'

import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaStudentsRepository implements StudentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(student: Student): Promise<void> {
    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(student),
    })
  }

  async findByEmail(email: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    return user ? PrismaStudentMapper.toDomain(user) : null
  }

  async findById(id: string): Promise<Student | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    })

    return user ? PrismaStudentMapper.toDomain(user) : null
  }
}
