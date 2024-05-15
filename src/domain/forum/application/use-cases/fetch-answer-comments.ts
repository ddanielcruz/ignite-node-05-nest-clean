import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { CommentWithAutor } from '../../enterprise/entities/value-objects/comment-with-author'
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository'

interface FetchAnswerCommentsRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsResponse = Either<
  never,
  { comments: CommentWithAutor[] }
>

@Injectable()
export class FetchAnswerComments {
  constructor(private readonly commentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const comments = await this.commentsRepository.findManyByAnswerIdWithAuthor(
      answerId,
      { page },
    )

    return right({ comments })
  }
}
