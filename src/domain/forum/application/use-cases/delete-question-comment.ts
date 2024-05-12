import { Injectable } from '@nestjs/common'

import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { QuestionCommentsRepository } from '../repositories/question-comments.repository'

interface DeleteQuestionCommentRequest {
  authorId: string
  questionCommentId: string
}

type DeleteQuestionCommentResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  void
>

@Injectable()
export class DeleteQuestionComment {
  constructor(
    private readonly questionsCommentRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    questionCommentId: commentId,
  }: DeleteQuestionCommentRequest): Promise<DeleteQuestionCommentResponse> {
    const comment = await this.questionsCommentRepository.findById(commentId)
    if (!comment) {
      return left(new ResourceNotFoundError())
    }

    if (!comment.authorId.equals(authorId)) {
      return left(new NotAllowedError())
    }

    await this.questionsCommentRepository.delete(comment)
    return right(undefined)
  }
}
