import { Injectable } from '@nestjs/common'

import { Either, right } from '@/core/either'

import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface FetchQuestionAnswersRequest {
  questionId: string
  page: number
}

type FetchQuestionAnswersResponse = Either<never, { answers: Answer[] }>

@Injectable()
export class FetchQuestionAnswers {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionAnswersRequest): Promise<FetchQuestionAnswersResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({ answers })
  }
}
