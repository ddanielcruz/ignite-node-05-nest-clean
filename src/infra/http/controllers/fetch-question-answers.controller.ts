import { Controller, Get, Param, Query } from '@nestjs/common'
import { z } from 'zod'

import { FetchQuestionAnswers } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { AnswerPresenter } from '../presenters/answer-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().int().min(1)),
})

type QueryParams = z.infer<typeof queryParamsSchema>

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(private readonly fetchQuestionAnswers: FetchQuestionAnswers) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query(new ZodValidationPipe(queryParamsSchema, { type: 'query' }))
    { page }: QueryParams,
  ) {
    const result = await this.fetchQuestionAnswers.execute({ page, questionId })
    const answers = result.value.answers.map(AnswerPresenter.toHTTP)

    return { answers }
  }
}
