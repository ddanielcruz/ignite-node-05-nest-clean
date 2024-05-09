import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { QuestionsRepository } from '../repositories/questions-repository'

interface DeleteQuestionRequest {
  authorId: string
  questionId: string
}

type DeleteQuestionResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  void
>

export class DeleteQuestion {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionRequest): Promise<DeleteQuestionResponse> {
    const question = await this.questionsRepository.findById(questionId)
    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }

    await this.questionsRepository.delete(question)
    return right(undefined)
  }
}
