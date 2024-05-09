import { DomainEvents } from '@/core/events/domain-events'
import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public questions: Question[] = []

  async create(question: Question): Promise<void> {
    this.questions.push(question)
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
    DomainEvents.dispatchEventsForAggregate(question.id)
  }
}
