import { Module } from '@nestjs/common'

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { StudentsRepository } from '@/domain/forum/application/repositories/students-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
    { provide: StudentsRepository, useClass: PrismaStudentsRepository },
  ],
  exports: [
    PrismaService,
    AnswersRepository,
    QuestionsRepository,
    StudentsRepository,
  ],
})
export class DatabaseModule {}
