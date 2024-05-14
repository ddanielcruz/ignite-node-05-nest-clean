import { Injectable } from '@nestjs/common'

import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments-repository'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly attachmentsRepo: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer): Promise<void> {
    await this.prisma.answer.create({
      data: PrismaAnswerMapper.toPrisma(answer),
    })

    await this.attachmentsRepo.createMany(answer.attachments.getItems())
  }

  async delete(answer: Answer): Promise<void> {
    await this.prisma.answer.delete({
      where: { id: answer.id.toString() },
    })

    await this.attachmentsRepo.deleteMany(answer.attachments.getItems())
  }

  async findById(id: string): Promise<Answer | null> {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    })

    return answer ? PrismaAnswerMapper.toDomain(answer) : null
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const answers = await this.prisma.answer.findMany({
      where: { questionId },
      take: DEFAULT_PAGE_SIZE,
      skip: (page - 1) * DEFAULT_PAGE_SIZE,
      orderBy: { createdAt: 'asc' },
    })

    return answers.map(PrismaAnswerMapper.toDomain)
  }

  async save(answer: Answer): Promise<void> {
    await Promise.all([
      this.prisma.answer.update({
        where: { id: answer.id.toString() },
        data: PrismaAnswerMapper.toPrisma(answer),
      }),
      this.attachmentsRepo.createMany(answer.attachments.getNewItems()),
      this.attachmentsRepo.deleteMany(answer.attachments.getRemovedItems()),
    ])
  }
}
