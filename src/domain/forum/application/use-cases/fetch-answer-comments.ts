import { Either, right } from '@/core/either'

import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository'

interface FetchAnswerCommentsRequest {
  answerId: string
  page: number
}

type FetchAnswerCommentsResponse = Either<never, { comments: AnswerComment[] }>

export class FetchAnswerComments {
  constructor(private readonly commentsRepository: AnswerCommentsRepository) {}

  async execute({
    answerId,
    page,
  }: FetchAnswerCommentsRequest): Promise<FetchAnswerCommentsResponse> {
    const comments = await this.commentsRepository.findManyByAnswerId(
      answerId,
      { page },
    )

    return right({ comments })
  }
}
