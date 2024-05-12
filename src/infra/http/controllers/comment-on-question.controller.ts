import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { CommentOnQuestion } from '@/domain/forum/application/use-cases/comment-on-question'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const commentOnQuestionBodySchema = z.object({
  content: z.string().trim().min(1),
})

type CommentOnQuestionBody = z.infer<typeof commentOnQuestionBodySchema>

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestion) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(commentOnQuestionBodySchema))
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CommentOnQuestionBody,
    @Param('questionId') questionId: string,
  ) {
    const { sub: userId } = user
    const { content } = body

    const result = await this.commentOnQuestion.execute({
      authorId: userId,
      questionId,
      content,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
