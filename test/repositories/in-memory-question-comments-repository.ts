import {
  DEFAULT_PAGE_SIZE,
  PaginationParams,
} from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public comments: QuestionComment[] = []

  async create(question: QuestionComment): Promise<void> {
    this.comments.push(question)
  }

  async delete(question: QuestionComment): Promise<void> {
    const index = this.comments.findIndex((c) => c.id === question.id)
    this.comments.splice(index, 1)
  }

  async findById(id: string): Promise<QuestionComment | null> {
    return this.comments.find((c) => c.id.value === id) || null
  }

  async findManyByQuestionId(
    questionId: string,
    options: PaginationParams,
  ): Promise<QuestionComment[]> {
    const offset = (options.page - 1) * DEFAULT_PAGE_SIZE
    return this.comments
      .filter((c) => c.questionId.value === questionId)
      .slice(offset, offset + DEFAULT_PAGE_SIZE)
  }
}
