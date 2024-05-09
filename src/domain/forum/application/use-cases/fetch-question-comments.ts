import { Either, right } from '@/core/either'

import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments.repository'

interface FetchQuestionCommentsRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsResponse = Either<
  never,
  { comments: QuestionComment[] }
>

export class FetchQuestionComments {
  constructor(
    private readonly commentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const comments = await this.commentsRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({ comments })
  }
}
