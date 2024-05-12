import {
  Body,
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
import { EditAnswer } from '@/domain/forum/application/use-cases/edit-answer'
import { CurrentUser, UserPayload } from '@/infra/auth/current-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'

const editAnswerBodySchema = z.object({
  content: z.string().trim().min(1),
})

type EditAnswerBody = z.infer<typeof editAnswerBodySchema>

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswer) {}

  @Put()
  @HttpCode(HttpStatus.NO_CONTENT)
  @UsePipes(new ZodValidationPipe(editAnswerBodySchema))
  async handle(
    @CurrentUser() user: UserPayload,
    @Body() body: EditAnswerBody,
    @Param('id') answerId: string,
  ) {
    const { sub: userId } = user
    const { content } = body
    const result = await this.editAnswer.execute({
      authorId: userId,
      answerId,
      content,
      attachmentIds: [],
    })

    if (result.isLeft()) {
      switch (result.value.constructor) {
        case ResourceNotFoundError:
          throw new NotFoundException(result.value.message)
        default:
          throw new ForbiddenException(result.value.message)
      }
    }
  }
}
