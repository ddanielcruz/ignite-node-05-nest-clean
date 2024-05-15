import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { CommentWithAutor } from '../../enterprise/entities/value-objects/comment-with-author'
import { QuestionCommentsRepository } from '../repositories/question-comments.repository'

interface FetchQuestionCommentsRequest {
  questionId: string
  page: number
}

type FetchQuestionCommentsResponse = Either<
  never,
  { comments: CommentWithAutor[] }
>

@Injectable()
export class FetchQuestionComments {
  constructor(
    private readonly commentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsRequest): Promise<FetchQuestionCommentsResponse> {
    const comments =
      await this.commentsRepository.findManyByQuestionIdWithAuthor(questionId, {
        page,
      })

    return right({ comments })
  }
}
