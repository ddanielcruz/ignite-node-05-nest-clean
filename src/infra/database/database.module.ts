import { Module } from '@nestjs/common'

import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'

@Module({
  providers: [
    PrismaService,
    { provide: AnswersRepository, useClass: PrismaAnswersRepository },
    { provide: QuestionsRepository, useClass: PrismaQuestionsRepository },
  ],
  exports: [PrismaService, AnswersRepository, QuestionsRepository],
})
export class DatabaseModule {}
