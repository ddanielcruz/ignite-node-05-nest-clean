import {
  Body,
  ConflictException,
  Controller,
  ForbiddenException,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Put,
  UsePipes,
} from '@nestjs/common'
import { z } from 'zod'

import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { EditQuestion } from '@/domain/forum/application/use-cases/edit-question'
import { DuplicateQuestionError } from '@/domain/forum/application/use-cases/errors/duplicate-question-error'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editQuestionBodySchema = z.object({
  title: z.string().trim().min(1),
  content: z.string().trim().min(1),
})

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestion) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(editQuestionBodySchema))
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: EditQuestionBody,
    @Param('id') questionId: string,
  ) {
    const { sub: userId } = user
    const { title, content } = body
    const result = await this.editQuestion.execute({
      authorId: userId,
      questionId,
      title,
      content,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(result.value.message)
        case DuplicateQuestionError:
          throw new ConflictException(result.value.message)
        default:
          throw new ForbiddenException(result.value.message)
      }
    }
  }
}
