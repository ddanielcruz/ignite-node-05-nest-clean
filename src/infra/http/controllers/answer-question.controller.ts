import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { AnswerQuestion } from '@/domain/forum/application/use-cases/answer-question'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const answerQuestionBodySchema = z.object({
  content: z.string().trim().min(1),
})

type AnswerQuestionBody = z.infer<typeof answerQuestionBodySchema>

@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {
  constructor(private readonly answerQuestion: AnswerQuestion) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(answerQuestionBodySchema))
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: AnswerQuestionBody,
    @Param('questionId') questionId: string,
  ) {
    const { sub: userId } = user
    const { content } = body

    await this.answerQuestion.execute({
      authorId: userId,
      questionId,
      content,
      attachmentIds: [],
    })
  }
}
