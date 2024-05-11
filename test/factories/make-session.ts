import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'

import { PrismaStudentMapper } from '@/infra/database/prisma/mappers/prisma-student-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'

import { makeStudent, StudentFactoryProps } from './make-student'

type SessionFactoryProps = StudentFactoryProps

@Injectable()
export class SessionFactory {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async make(override?: SessionFactoryProps) {
    const user = makeStudent(override)
    await this.prisma.user.create({
      data: PrismaStudentMapper.toPrisma(user),
    })

    const accessToken = await this.jwt.signAsync({
      sub: user.id.toString(),
    })

    return {
      user,
      accessToken,
    }
  }
}
