import { PaginationParams } from '@/core/repositories/pagination-params'

import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { CommentWithAutor } from '../../enterprise/entities/value-objects/comment-with-author'

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>
  abstract delete(answerComment: AnswerComment): Promise<void>
  abstract findById(id: string): Promise<AnswerComment | null>

  abstract findManyByAnswerId(
    answerId: string,
    options: PaginationParams,
  ): Promise<AnswerComment[]>

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    options: PaginationParams,
  ): Promise<CommentWithAutor[]>
}
