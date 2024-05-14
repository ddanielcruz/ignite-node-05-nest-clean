import { DomainEvents } from '@/core/events/domain-events'
import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

import { InMemoryAnswerAttachmentsRepository } from './in-memory-answer-attachments-repository'

export class InMemoryAnswersRepository implements AnswersRepository {
  public readonly attachmentsRepo: InMemoryAnswerAttachmentsRepository

  public answers: Answer[] = []

  constructor(attachmentsRepo?: InMemoryAnswerAttachmentsRepository) {
    this.attachmentsRepo =
      attachmentsRepo ?? new InMemoryAnswerAttachmentsRepository()
  }

  async create(answer: Answer): Promise<void> {
    this.answers.push(answer)
    await this.attachmentsRepo.createMany(answer.attachments.getItems())

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }

  async delete(answer: Answer): Promise<void> {
    this.answers = this.answers.filter(
      (item) => item.id.value !== answer.id.value,
    )

    await this.attachmentsRepo.deleteMany(answer.attachments.getItems())
  }

  async findById(id: string): Promise<Answer | null> {
    return this.answers.find((answer) => answer.id.value === id) ?? null
  }

  async findManyByQuestionId(
    questionId: string,
    { page }: PaginationParams,
  ): Promise<Answer[]> {
    const offset = (page - 1) * DEFAULT_PAGE_SIZE
    return this.answers
      .filter((answer) => answer.questionId.value === questionId)
      .slice(offset, offset + DEFAULT_PAGE_SIZE)
  }

  async save(answer: Answer): Promise<void> {
    this.answers = this.answers.map((item) =>
      item.id.value === answer.id.value ? answer : item,
    )

    await this.attachmentsRepo.createMany(answer.attachments.getNewItems())
    await this.attachmentsRepo.deleteMany(answer.attachments.getRemovedItems())

    DomainEvents.dispatchEventsForAggregate(answer.id)
  }
}
