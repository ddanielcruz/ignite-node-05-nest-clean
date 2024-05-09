import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public comments: AnswerComment[] = []

  async create(answer: AnswerComment): Promise<void> {
    this.comments.push(answer)
  }

  async delete(answer: AnswerComment): Promise<void> {
    const index = this.comments.findIndex((c) => c.id === answer.id)
    this.comments.splice(index, 1)
  }

  async findById(id: string): Promise<AnswerComment | null> {
    return this.comments.find((c) => c.id.value === id) || null
  }

  async findManyByAnswerId(
    answerId: string,
    options: PaginationParams,
  ): Promise<AnswerComment[]> {
    const offset = (options.page - 1) * DEFAULT_PAGE_SIZE
    return this.comments
      .filter((c) => c.answerId.value === answerId)
      .slice(offset, offset + DEFAULT_PAGE_SIZE)
  }
}
