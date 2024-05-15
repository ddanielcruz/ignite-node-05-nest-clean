import { PaginationParams } from '@/core/repositories/pagination-params'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import { CommentWithAutor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class QuestionCommentsRepository {
  abstract create(questionComment: QuestionComment): Promise<void>
  abstract delete(questionComment: QuestionComment): Promise<void>
  abstract findById(id: string): Promise<QuestionComment | null>

  abstract findManyByQuestionId(
    questionId: string,
    options: PaginationParams,
  ): Promise<QuestionComment[]>

  abstract findManyByQuestionIdWithAuthor(
    questionId: string,
    options: PaginationParams,
  ): Promise<CommentWithAutor[]>
}
