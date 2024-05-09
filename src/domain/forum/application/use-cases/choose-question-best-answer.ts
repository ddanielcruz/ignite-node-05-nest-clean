import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

import { Question } from '../../enterprise/entities/question'
import { AnswersRepository } from '../repositories/answers-repository'
import { QuestionsRepository } from '../repositories/questions-repository'

interface ChooseQuestionBestAnswerRequest {
  authorId: string
  answerId: string
}

type ChooseQuestionBestAnswerResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { question: Question }
>

export class ChooseQuestionBestAnswer {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerRequest): Promise<ChooseQuestionBestAnswerResponse> {
    const answer = await this.answersRepository.findById(answerId)
    if (!answer) {
      return left(new ResourceNotFoundError())
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.value,
    )
    if (!question) {
      return left(new ResourceNotFoundError())
    }

    if (question.authorId.value !== authorId) {
      return left(new NotAllowedError())
    }

    question.bestAnswerId = answer.id
    await this.questionsRepository.save(question)

    return right({ question })
  }
}
