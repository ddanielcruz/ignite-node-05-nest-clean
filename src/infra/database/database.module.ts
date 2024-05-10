import { Module } from '@nestjs/common'

import { PrismaService } from './prisma/prisma.service'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'

@Module({
  providers: [
    PrismaService,
    PrismaAnswersRepository,
    PrismaQuestionsRepository,
  ],
  exports: [PrismaService, PrismaAnswersRepository, PrismaQuestionsRepository],
})
export class DatabaseModule {}
