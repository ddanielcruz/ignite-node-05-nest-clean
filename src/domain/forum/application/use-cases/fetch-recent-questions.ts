import { Either, right } from '@/core/either'

import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface FetchRecentQuestionsRequest {
  page: number
}

type FetchRecentQuestionsResponse = Either<never, { questions: Question[] }>

export class FetchRecentQuestions {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    page,
  }: FetchRecentQuestionsRequest): Promise<FetchRecentQuestionsResponse> {
    const questions = await this.questionsRepository.findManyRecent({ page })
    return right({ questions })
  }
}
