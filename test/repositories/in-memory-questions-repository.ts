import { DomainEvents } from '@/core/events/domain-events'
import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'

import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'

interface InMemoryQuestionsRepositoryParams {
  questionAttachmentsRepo?: InMemoryQuestionAttachmentsRepository
  attachmentsRepo?: InMemoryAttachmentsRepository
  studentsRepo?: InMemoryStudentsRepository
}

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questionAttachmentsRepo: InMemoryQuestionAttachmentsRepository
  public studentsRepo: InMemoryStudentsRepository
  public attachmentsRepo: InMemoryAttachmentsRepository
  public questions: Question[] = []

  constructor({
    questionAttachmentsRepo,
    attachmentsRepo,
    studentsRepo,
  }: InMemoryQuestionsRepositoryParams = {}) {
    this.questionAttachmentsRepo =
      questionAttachmentsRepo ?? new InMemoryQuestionAttachmentsRepository()
    this.attachmentsRepo =
      attachmentsRepo ?? new InMemoryAttachmentsRepository()
    this.studentsRepo = studentsRepo ?? new InMemoryStudentsRepository()
  }

  async create(question: Question): Promise<void> {
    this.questions.push(question)
    await this.questionAttachmentsRepo.createMany(
      question.attachments.getItems(),
    )

    DomainEvents.dispatchEventsForAggregate(question.id)
  }

  async delete(question: Question): Promise<void> {
    this.questions = this.questions.filter(
      (item) => item.id.value !== question.id.value,
    )
  }

  async findById(id: string): Promise<Question | null> {
    return this.questions.find((question) => question.id.value === id) ?? null
  }

  async findBySlug(slug: string): Promise<Question | null> {
    return (
      this.questions.find((question) => question.slug.value === slug) ?? null
    )
  }

  async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
    const question = await this.findBySlug(slug)
    if (!question) {
      return null
    }

    const author = await this.studentsRepo.findById(question.authorId.value)
    if (!author) {
      throw new Error('Author not found')
    }

    const questionAttachmentIds = this.questionAttachmentsRepo.attachments
      .filter((attachment) => attachment.questionId.equals(question.id))
      .map((attachment) => attachment.attachmentId.toString())
    const attachments = this.attachmentsRepo.attachments.filter((attachment) =>
      questionAttachmentIds.includes(attachment.id.toString()),
    )

    return new QuestionDetails({
      question: {
        id: question.id,
        content: question.content,
        title: question.title,
        slug: question.slug,
        createdAt: question.createdAt,
        updatedAt: question.updatedAt,
      },
      author: {
        id: author.id,
        name: author.name,
      },
      bestAnswerId: question.bestAnswerId,
      attachments,
    })
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const offset = (page - 1) * DEFAULT_PAGE_SIZE
    return this.questions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + DEFAULT_PAGE_SIZE)
  }

  async save(question: Question): Promise<void> {
    this.questions = this.questions.map((item) =>
      item.id.value === question.id.value ? question : item,
    )

    const createdAttachments = question.attachments.getNewItems()
    await this.questionAttachmentsRepo.createMany(createdAttachments)

    const deletedAttachments = question.attachments.getRemovedItems()
    await this.questionAttachmentsRepo.deleteMany(deletedAttachments)

    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
