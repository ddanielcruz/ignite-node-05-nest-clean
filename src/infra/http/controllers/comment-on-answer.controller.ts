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

import { CommentOnAnswer } from '@/domain/forum/application/use-cases/comment-on-answer'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const commentOnAnswerBodySchema = z.object({
  content: z.string().trim().min(1),
})

type CommentOnAnswerBody = z.infer<typeof commentOnAnswerBodySchema>

@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {
  constructor(private readonly commentOnAnswer: CommentOnAnswer) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(commentOnAnswerBodySchema))
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CommentOnAnswerBody,
    @Param('answerId') answerId: string,
  ) {
    const { sub: userId } = user
    const { content } = body

    const result = await this.commentOnAnswer.execute({
      authorId: userId,
      answerId,
      content,
    })

    if (result.isLeft()) {
      throw new NotFoundException(result.value.message)
    }
  }
}
