import { Injectable } from '@nestjs/common'

import { DomainEvents } from '@/core/events/domain-events'
import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { CacheRepository } from '@/infra/cache/cache-repository'

import { PrismaQuestionDetailsMapper } from '../mappers/prisma-question-details-mapper'
import { PrismaQuestionMapper } from '../mappers/prisma-question-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheRepository,
    private readonly attachmentsRepo: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question): Promise<void> {
    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    })

    await this.attachmentsRepo.createMany(question.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    await this.prisma.question.delete({
      where: { id: question.id.toString() },
    })

    await this.attachmentsRepo.deleteMany(question.attachments.getItems())
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { id },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: { slug },
    })

    return question ? PrismaQuestionMapper.toDomain(question) : null
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const cacheKey = `question:${slug}:details`
    const cachedQuestion = await this.cache.get(cacheKey)

    if (cachedQuestion) {
      return JSON.parse(cachedQuestion)
    }

    const question = await this.prisma.question.findUnique({
      where: { slug },
      include: {
        author: true,
        attachments: true,
      },
    })

    if (!question) {
      return null
    }

    const questionDetails = PrismaQuestionDetailsMapper.toDomain(question)
    await this.cache.set(cacheKey, JSON.stringify(questionDetails))

    return questionDetails
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      take: DEFAULT_PAGE_SIZE,
      skip: (page - 1) * DEFAULT_PAGE_SIZE,
      orderBy: { createdAt: 'desc' },
    })

    return questions.map(PrismaQuestionMapper.toDomain)
  }

  async save(question: Question): Promise<void> {
    await Promise.all([
      this.prisma.question.update({
        where: { id: question.id.toString() },
        data: PrismaQuestionMapper.toPrisma(question),
      }),
      this.attachmentsRepo.createMany(question.attachments.getNewItems()),
      this.attachmentsRepo.deleteMany(question.attachments.getRemovedItems()),
      this.cache.delete(`question:${question.slug.value}:details`),
    ])

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
