import { Controller, Get, Query } from '@nestjs/common'
import { z } from 'zod'

import { FetchRecentQuestions } from '@/domain/forum/application/use-cases/fetch-recent-questions'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { QuestionPresenter } from '../presenters/question-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().int().min(1)),
})

type QueryParams = z.infer<typeof queryParamsSchema>

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(private readonly fetchRecentQuestions: FetchRecentQuestions) {}

  @Get()
  async handle(
    @Query(new ZodValidationPipe(queryParamsSchema, { type: 'query' }))
    { page }: QueryParams,
  ) {
    const result = await this.fetchRecentQuestions.execute({ page })
    const questions = result.value.questions.map(QuestionPresenter.toHTTP)

    return { questions }
  }
}
