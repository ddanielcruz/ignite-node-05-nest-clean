import { Controller, Get, Param, Query } from '@nestjs/common'
import { z } from 'zod'

import { FetchQuestionComments } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

import { CommentWithAuthorPresenter } from '../presenters/comment-with-author-presenter'

const queryParamsSchema = z.object({
  page: z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().int().min(1)),
})

type QueryParams = z.infer<typeof queryParamsSchema>

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(private readonly fetchQuestionComments: FetchQuestionComments) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query(new ZodValidationPipe(queryParamsSchema, { type: 'query' }))
    { page }: QueryParams,
  ) {
    const result = await this.fetchQuestionComments.execute({
      page,
      questionId,
    })
    const comments = result.value.comments.map(
      CommentWithAuthorPresenter.toHTTP,
    )

    return { comments }
  }
}
