import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { AnswersRepository } from '../repositories/answers-repository'

interface DeleteAnswerRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  void
>

export class DeleteAnswer {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerRequest): Promise<DeleteAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    if (answer.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(answer)

    return right(undefined)
  }
}
