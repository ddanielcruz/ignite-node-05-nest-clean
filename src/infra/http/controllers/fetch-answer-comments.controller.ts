import { Controller, Get, Param, Query } from '@nestjs/common'
import { z } from 'zod'

import { FetchAnswerComments } from '@/domain/forum/application/use-cases/fetch-answer-comments'
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

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(private readonly fetchAnswerComments: FetchAnswerComments) {}

  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query(new ZodValidationPipe(queryParamsSchema, { type: 'query' }))
    { page }: QueryParams,
  ) {
    const result = await this.fetchAnswerComments.execute({
      page,
      answerId,
    })
    const comments = result.value.comments.map(
      CommentWithAuthorPresenter.toHTTP,
    )

    return { comments }
  }
}
