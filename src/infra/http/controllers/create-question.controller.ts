import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { CreateQuestion } from '@/domain/forum/application/use-cases/create-question'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const createQuestionBodySchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
})

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>

@Controller('/questions')
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestion) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(createQuestionBodySchema))
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: CreateQuestionBody,
  ) {
    const { sub: userId } = user
    const { title, content } = body
    const result = await this.createQuestion.execute({
      authorId: userId,
      title,
      content,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      throw new ConflictException(result.value.message)
    }

    return result.value
  }
}
